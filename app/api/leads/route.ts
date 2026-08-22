import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadSource, LeadIntent, PropertyType } from "@/lib/types";
import { saveLead } from "@/lib/leads-store";

// Allow the public marketing site (a different origin/domain) to POST here.
// Once the site has a permanent domain, replace "*" with that exact origin
// for tighter security, e.g. "https://www.wiljoenterprises.com".
const ALLOWED_ORIGIN = process.env.LEADS_ALLOWED_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

const VALID_SOURCES: LeadSource[] = [
  "website-list-with-us",
  "website-enquiry",
  "website-chatbot",
  "whatsapp",
  "phone",
  "referral",
  "other",
];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400, headers: corsHeaders() });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const source: LeadSource = VALID_SOURCES.includes(body.source as LeadSource)
    ? (body.source as LeadSource)
    : "other";

  // Chatbot interactions often won't include contact details yet — still log
  // them (as "Website Chat Visitor") so nothing is missed while the visitor
  // is still on the page. Every other source requires a name plus at least
  // one way to reach the person.
  if (source !== "website-chatbot" && (!name || (!email && !phone))) {
    return NextResponse.json(
      { ok: false, error: "A name and at least one of email/phone are required." },
      { status: 400, headers: corsHeaders() }
    );
  }
  if (source === "website-chatbot" && !name && !email && !phone && !body.message) {
    return NextResponse.json(
      { ok: false, error: "Nothing to log." },
      { status: 400, headers: corsHeaders() }
    );
  }

  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name || "Website Chat Visitor",
    email,
    phone,
    source,
    status: "new",
    intent: (body.intent as LeadIntent) || null,
    propertyType: (body.propertyType as PropertyType) || null,
    interest: body.interest ? String(body.interest) : null,
    location: body.location ? String(body.location) : null,
    budgetOrPrice: body.budgetOrPrice ? String(body.budgetOrPrice) : null,
    message: body.message ? String(body.message) : null,
    receivedDate: new Date().toISOString(),
    assignedAgentId: "a1", // Nigel, the listing agent — adjust routing logic here if you add more agents
  };

  // Persist to Vercel KV if it's configured — see SETUP_LEADS_CRM.md.
  const stored = await saveLead(lead);

  // Always attempt an email notification too, so a lead is never missed even
  // before KV is set up. Requires RESEND_API_KEY + LEADS_NOTIFY_EMAIL env vars.
  const emailed = await notifyByEmail(lead);

  return NextResponse.json(
    { ok: true, stored, emailed },
    { status: 200, headers: corsHeaders() }
  );
}

async function notifyByEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL || "wiljoenterprisesltd@hotmail.com";
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL || "Wiljo Website <leads@resend.dev>",
        to: [to],
        subject: `New lead — ${lead.name} (${lead.source})`,
        text: [
          `New lead captured from the Wiljo Enterprises website.`,
          ``,
          `Name: ${lead.name}`,
          `Email: ${lead.email || "—"}`,
          `Phone: ${lead.phone || "—"}`,
          `Source: ${lead.source}`,
          lead.intent ? `Intent: ${lead.intent}` : null,
          lead.propertyType ? `Property type: ${lead.propertyType}` : null,
          lead.interest ? `Interest: ${lead.interest}` : null,
          lead.location ? `Location: ${lead.location}` : null,
          lead.budgetOrPrice ? `Budget/Price: ${lead.budgetOrPrice}` : null,
          lead.message ? `Message: ${lead.message}` : null,
          ``,
          `Received: ${lead.receivedDate}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Lead email notification failed:", err);
    return false;
  }
}
