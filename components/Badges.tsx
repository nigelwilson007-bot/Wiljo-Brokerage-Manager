import { ListingStatus, InvoiceStatus, ListingKind } from "@/lib/types";

const listingStatusStyles: Record<ListingStatus, string> = {
  active: "bg-primary-light text-primary-dark",
  "under-offer": "bg-gold-light text-gold",
  sold: "bg-bg text-inkmuted",
  let: "bg-bg text-inkmuted",
  withdrawn: "bg-signal-light text-signal",
};

const listingStatusLabel: Record<ListingStatus, string> = {
  active: "Active",
  "under-offer": "Under offer",
  sold: "Sold",
  let: "Let",
  withdrawn: "Withdrawn",
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${listingStatusStyles[status]}`}
    >
      {listingStatusLabel[status]}
    </span>
  );
}

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  proforma: "bg-gold-light text-gold",
  issued: "bg-bg text-inkmuted",
  paid: "bg-primary-light text-primary-dark",
  overdue: "bg-signal-light text-signal",
};

const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  proforma: "Proforma",
  issued: "Issued",
  paid: "Paid",
  overdue: "Overdue",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${invoiceStatusStyles[status]}`}
    >
      {invoiceStatusLabel[status]}
    </span>
  );
}

export function ListingKindBadge({ kind }: { kind: ListingKind }) {
  return (
    <span className="inline-flex items-center rounded-full bg-bg px-2.5 py-0.5 text-xs font-medium capitalize text-inkmuted">
      {kind}
    </span>
  );
}

export function FolioTag({ folio }: { folio: string }) {
  return (
    <span className="font-data text-[11px] tracking-tight text-inkmuted">
      {folio}
    </span>
  );
}
