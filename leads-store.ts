// Storage layer for CRM leads captured from the public website.
//
// Uses Upstash Redis (installed via the Vercel Marketplace — this is what
// Vercel now points you to; the old standalone "Vercel KV" product was
// discontinued and existing stores were migrated to Upstash automatically)
// when it's configured. Detected via the KV_REST_API_URL / KV_REST_API_TOKEN
// env vars that the Marketplace integration injects automatically. If it
// isn't configured yet, reads fall back to the static `leads` array in
// lib/data.ts and writes are skipped (the API route still sends the email
// notification either way — see app/api/leads/route.ts — so you never miss
// a lead even before this is set up, you just won't see it in this
// dashboard until it is).
//
// See SETUP_LEADS_CRM.md for the exact setup steps.

import { Lead } from "./types";
import { leads as fallbackLeads } from "./data";

const KV_KEY = "wiljo:leads";

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getAllLeads(): Promise<{ leads: Lead[]; live: boolean }> {
  if (!kvConfigured()) {
    return { leads: fallbackLeads, live: false };
  }
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    const stored = await redis.get<Lead[]>(KV_KEY);
    return { leads: stored ?? [], live: true };
  } catch (err) {
    console.error("Leads store read failed, falling back to static sample data:", err);
    return { leads: fallbackLeads, live: false };
  }
}

export async function saveLead(lead: Lead): Promise<boolean> {
  if (!kvConfigured()) return false;
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    const existing = (await redis.get<Lead[]>(KV_KEY)) ?? [];
    await redis.set(KV_KEY, [lead, ...existing]);
    return true;
  } catch (err) {
    console.error("Leads store write failed:", err);
    return false;
  }
}
