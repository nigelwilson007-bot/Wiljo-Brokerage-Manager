// Core domain types for Wiljo Enterprises Ltd — a real estate brokerage.
// Wiljo lists properties on behalf of clients (vendors/landlords) for sale
// or rent, and earns commission on completed deals. It does not own units
// or collect rent itself — it brokers deals and invoices commission.
//
// Swap `lib/data.ts` for real database calls (Postgres/Supabase/etc.) when
// ready — these types define the contract the rest of the app relies on.

export type AgentRole = "admin" | "agent" | "secretary";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AgentRole;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "vendor" | "landlord" | "buyer" | "tenant";
}

export type ListingKind = "sale" | "rental";

export type ListingStatus =
  | "active" // open listing, on the market
  | "under-offer" // offer accepted, deal in progress
  | "sold" // sale completed
  | "let" // rental completed (tenant placed)
  | "withdrawn"; // listing pulled, no longer active

export type PropertyType = "residential" | "commercial" | "mixed-use" | "land";

export interface Listing {
  id: string;
  folio: string; // internal record number, e.g. "WJE-2026-014"
  title: string;
  address: string;
  city: string;
  propertyType: PropertyType;
  listingKind: ListingKind;
  askingPrice: number; // sale price OR monthly rent, depending on listingKind
  commissionRate: number; // e.g. 0.03 for 3%
  status: ListingStatus;
  clientId: string; // the vendor/landlord
  agentId: string; // the listing agent
  listedDate: string; // ISO date
  closedDate: string | null; // ISO date when sold/let, else null
  closedPrice: number | null; // actual sale price or agreed rent once closed
}

export type InvoiceStatus = "proforma" | "issued" | "paid" | "overdue";

export interface CommissionInvoice {
  id: string;
  invoiceNo: string; // e.g. "WJE-2026-001"
  listingId: string;
  basis: number; // sale/rent price the commission is calculated on
  rate: number; // commission rate used
  amount: number; // computed commission amount
  status: InvoiceStatus;
  issuedDate: string; // ISO date
  dueDate: string | null;
  paidDate: string | null;
}

export type DocumentType =
  | "broker-agreement"
  | "listing-ad"
  | "invoice"
  | "title-deed"
  | "valuation"
  | "tax-receipt"
  | "other";

export interface ListingDocument {
  id: string;
  listingId: string;
  name: string;
  type: DocumentType;
  uploadedDate: string; // ISO date
  sizeKb: number;
}
