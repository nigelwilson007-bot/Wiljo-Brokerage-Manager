import { Listing, CommissionInvoice, ListingDocument, Agent, Client, Lead } from "./types";

// ── Agents (your team) ──────────────────────────────────────────────────
export const agents: Agent[] = [
  { id: "a1", name: "Nigel Wilson", email: "wiljoenterprisesltd@hotmail.com", phone: "1-868-286-3626", role: "agent" },
  { id: "a2", name: "Renuka Wilson", email: "wiljoenterprisesltd@hotmail.com", phone: "1-868-286-3626", role: "secretary" },
];

// ── Clients (vendors / landlords / buyers / tenants) ────────────────────
export const clients: Client[] = [
  { id: "c1", name: "Mrs. Ancilla Peters", email: "elora.ince@yahoo.com", phone: "1-868-744-5968", type: "vendor" },
  // TODO: add your other clients here as you take on new listings
];

// ── Listings ─────────────────────────────────────────────────────────────
// Real listing from your uploaded documents. Replace the two sample listings
// below with your actual portfolio — see README for the easiest way to do this.
export const listings: Listing[] = [
  {
    id: "l1",
    folio: "WJE-2026-001",
    title: "Commercial Income Property — #3 Lp#61 Darrel Spring",
    address: "#3 Lp#61 Darrel Spring",
    city: "Scarborough, Tobago",
    propertyType: "commercial",
    listingKind: "sale",
    askingPrice: 3200000,
    commissionRate: 0.03,
    status: "active",
    clientId: "c1",
    agentId: "a1",
    listedDate: "2026-06-23",
    closedDate: null,
    closedPrice: null,
  },
  // ⬇ Sample placeholder listings — replace with your real data
  {
    id: "l2",
    folio: "WJE-2026-002",
    title: "Sample — 2-Bedroom Apartment, Glencoe",
    address: "Sample Address, Glencoe",
    city: "Port of Spain",
    propertyType: "residential",
    listingKind: "rental",
    askingPrice: 4500,
    commissionRate: 0.1, // commonly one month's rent for rental placements
    status: "under-offer",
    clientId: "c1",
    agentId: "a2",
    listedDate: "2026-05-10",
    closedDate: null,
    closedPrice: null,
  },
  {
    id: "l3",
    folio: "WJE-2026-003",
    title: "Sample — Retail Unit, Chaguanas Main Road",
    address: "Sample Address, Main Road",
    city: "Chaguanas",
    propertyType: "commercial",
    listingKind: "sale",
    askingPrice: 1850000,
    commissionRate: 0.03,
    status: "sold",
    clientId: "c1",
    agentId: "a1",
    listedDate: "2026-02-01",
    closedDate: "2026-05-20",
    closedPrice: 1780000,
  },
];

// ── Commission invoices ─────────────────────────────────────────────────
export const invoices: CommissionInvoice[] = [
  {
    id: "i1",
    invoiceNo: "WJE-2026-001",
    listingId: "l1",
    basis: 3200000,
    rate: 0.03,
    amount: 96000,
    status: "proforma",
    issuedDate: "2026-06-23",
    dueDate: null,
    paidDate: null,
  },
  {
    id: "i2",
    invoiceNo: "WJE-2026-002",
    listingId: "l3",
    basis: 1780000,
    rate: 0.03,
    amount: 53400,
    status: "paid",
    issuedDate: "2026-05-20",
    dueDate: "2026-05-27",
    paidDate: "2026-05-25",
  },
];

// ── Documents ────────────────────────────────────────────────────────────
export const documents: ListingDocument[] = [
  { id: "d1", listingId: "l1", name: "Broker Retention Agreement — Ancilla Peters.pdf", type: "broker-agreement", uploadedDate: "2026-06-23", sizeKb: 412 },
  { id: "d2", listingId: "l1", name: "Property Ad — Darrel Spring.pdf", type: "listing-ad", uploadedDate: "2026-06-23", sizeKb: 1180 },
  { id: "d3", listingId: "l1", name: "Proforma Invoice — Darrel Spring.xlsx", type: "invoice", uploadedDate: "2026-06-23", sizeKb: 28 },
  { id: "d4", listingId: "l3", name: "Sample — Title Deed.pdf", type: "title-deed", uploadedDate: "2026-02-01", sizeKb: 960 },
];

// ── Leads (CRM) ──────────────────────────────────────────────────────────
// This static array is only a fallback/demo view. Once you connect Vercel KV
// (see SETUP_LEADS_CRM.md), live leads captured from the website are read
// from KV at request time in app/leads/page.tsx and this array is ignored.
// It exists so the Leads page still shows something sensible before KV is
// configured, and so the shape of a lead is obvious for local development.
export const leads: Lead[] = [
  {
    id: "demo-1",
    name: "Sample Lead — Jordan Ramnarine",
    email: "jordan.sample@example.com",
    phone: "1-868-555-0100",
    source: "website-enquiry",
    status: "new",
    intent: "buy",
    propertyType: "commercial",
    interest: "Darrel Spring listing",
    location: "Canada",
    budgetOrPrice: "TT$3,000,000 – 3,300,000",
    message: "This is placeholder data — remove once real leads start arriving via the website.",
    receivedDate: "2026-08-01T14:30:00.000Z",
    assignedAgentId: "a1",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────
export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getInvoicesForListing(listingId: string): CommissionInvoice[] {
  return invoices.filter((i) => i.listingId === listingId);
}

export function getDocumentsForListing(listingId: string): ListingDocument[] {
  return documents.filter((d) => d.listingId === listingId);
}

export function getLeadsSorted(source: Lead[] = leads): Lead[] {
  return [...source].sort(
    (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
  );
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: "TTD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
