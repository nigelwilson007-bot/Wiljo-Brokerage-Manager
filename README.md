# Wiljo Enterprises — Brokerage Manager

An internal tool for tracking listings, commission, and documents for **Wiljo
Enterprises Ltd**, a real estate brokerage in Trinidad & Tobago. Built with
Next.js (App Router) + TypeScript + Tailwind CSS.

## What this app is for

Wiljo lists properties for sale or rent **on behalf of clients** (vendors and
landlords) and earns commission on completed deals — it does not own
property or collect rent itself. The app reflects that:

- **Overview** — active pipeline value, potential commission, commission
  earned vs. outstanding, and anything needing attention (proforma or
  overdue invoices)
- **Listings** — every property you're brokering: sale or rental, asking
  price, status (active / under offer / sold / let / withdrawn), client, and
  assigned agent
- **Commission** — invoices tied to each listing, tracking the rate used,
  the amount, and whether it's proforma, issued, paid, or overdue
- **Documents** — broker retention agreements, listing ads, invoices, title
  deeds, grouped by listing

## Your real data so far

One real listing is loaded in from the documents you provided:

- **#3 Lp#61 Darrel Spring, Scarborough, Tobago** — commercial income
  property, TT$3,200,000 asking price, 3% commission, client Mrs. Ancilla
  Peters, agent Nigel Wilson, proforma invoice WJE-2026-001 for TT$96,000

Two **sample/placeholder listings** are included so the app doesn't look
empty — they're clearly marked in `lib/data.ts`. Replace or remove them with
your real listings whenever you're ready (see "Adding your real data" below).

Your logo is in `public/wiljo-logo.png` and is wired into the sidebar and
browser tab icon.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

**Option A — push to GitHub, then import in Vercel (recommended)**

1. Create a new GitHub repo and push this folder to it.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Next.js — no config needed. Click Deploy.
4. Every future push to `main` redeploys automatically; every PR gets its own
   preview URL.

**Option B — deploy straight from your machine**

```bash
npm install -g vercel
vercel
```

## Adding your real data

Everything lives in `lib/data.ts` for now — no database yet. To add a new
listing, copy this shape and add it to the `listings` array:

```ts
{
  id: "l4",                          // unique, just increment the number
  folio: "WJE-2026-004",             // your internal reference number
  title: "Short description of the property",
  address: "Street address",
  city: "City, island",
  propertyType: "residential",       // residential | commercial | mixed-use | land
  listingKind: "sale",               // sale | rental
  askingPrice: 1500000,              // sale price, or monthly rent if rental
  commissionRate: 0.03,              // 0.03 = 3%
  status: "active",                  // active | under-offer | sold | let | withdrawn
  clientId: "c1",                    // must match an id in the clients array
  agentId: "a1",                     // must match an id in the agents array
  listedDate: "2026-06-23",
  closedDate: null,
  closedPrice: null,
}
```

Add new clients to the `clients` array and new agents to `agents` the same
way. The easiest way to do a bulk import of many listings at once is to send
me a spreadsheet — I can map it directly into this file.

## Next steps (when you're ready)

- **Real database** — swap `lib/data.ts` for calls to Postgres, Supabase, or
  similar, so listings can be added through the UI instead of editing code.
- **Authentication** — add login + role-based access (admin / agent /
  secretary) before this goes anywhere near sensitive client data.
- **Forms that actually save** — "Add listing," "New invoice," and "Upload
  document" buttons are currently placeholders.
- **DocuSign integration** — since broker retention agreements are signed
  electronically, this could link out to or trigger a DocuSign envelope
  directly from a listing.

## Project structure

```
app/
  page.tsx                Overview dashboard
  listings/
    page.tsx               Listings list
    [id]/page.tsx           Listing detail (client, invoices, documents)
  commission/page.tsx       Commission invoices across all listings
  documents/page.tsx         Documents across all listings
  layout.tsx                Root layout (sidebar shell)
  globals.css                Global styles + fonts
components/
  Sidebar.tsx
  PageHeader.tsx
  Badges.tsx
lib/
  types.ts                   Domain types (Listing, Client, Agent, CommissionInvoice, ListingDocument)
  data.ts                     Your data + helper functions
```
