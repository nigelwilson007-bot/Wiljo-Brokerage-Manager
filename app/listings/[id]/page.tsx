import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListing,
  getInvoicesForListing,
  getDocumentsForListing,
  getClient,
  getAgent,
  formatCurrency,
  formatDate,
  listings,
} from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ListingStatusBadge, InvoiceStatusBadge, ListingKindBadge, FolioTag } from "@/components/Badges";

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = getListing(params.id);
  if (!listing) notFound();

  const listingInvoices = getInvoicesForListing(listing.id);
  const listingDocuments = getDocumentsForListing(listing.id);
  const client = getClient(listing.clientId);
  const agent = getAgent(listing.agentId);
  const potentialCommission = listing.askingPrice * listing.commissionRate;

  return (
    <div>
      <PageHeader
        title={listing.title}
        subtitle={`${listing.address}, ${listing.city}`}
        action={<ListingStatusBadge status={listing.status} />}
      />

      <div className="px-8 py-6">
        <Link href="/listings" className="mb-6 inline-block text-xs font-medium text-primary hover:underline">
          ← Back to listings
        </Link>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Folio">
            <FolioTag folio={listing.folio} />
          </Field>
          <Field label="Kind">
            <ListingKindBadge kind={listing.listingKind} />
          </Field>
          <Field label="Property type">
            <span className="capitalize text-ink">{listing.propertyType.replace("-", " ")}</span>
          </Field>
          <Field label={listing.listingKind === "rental" ? "Monthly rent" : "Asking price"}>
            <span className="font-data text-ink">{formatCurrency(listing.askingPrice)}</span>
          </Field>
          <Field label="Commission rate">
            <span className="font-data text-ink">{(listing.commissionRate * 100).toFixed(1)}%</span>
          </Field>
          <Field label="Potential commission">
            <span className="font-data text-primary-dark">{formatCurrency(potentialCommission)}</span>
          </Field>
          <Field label="Client">
            <span className="text-ink">{client?.name ?? "Unassigned"}</span>
          </Field>
          <Field label="Listing agent">
            <span className="text-ink">{agent?.name ?? "Unassigned"}</span>
          </Field>
          <Field label="Listed">
            <span className="text-ink">{formatDate(listing.listedDate)}</span>
          </Field>
          {listing.closedDate && (
            <Field label={listing.listingKind === "sale" ? "Sold" : "Let"}>
              <span className="text-ink">{formatDate(listing.closedDate)}</span>
            </Field>
          )}
          {listing.closedPrice && (
            <Field label="Closed price">
              <span className="font-data text-ink">{formatCurrency(listing.closedPrice)}</span>
            </Field>
          )}
        </div>

        {client && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold text-ink">Client contact</h2>
            <div className="rounded-lg border border-line bg-surface px-5 py-4">
              <p className="text-sm font-medium text-ink">{client.name}</p>
              <p className="text-xs capitalize text-inkmuted">{client.type}</p>
              <p className="mt-2 text-sm text-ink">{client.email}</p>
              <p className="text-sm text-ink">{client.phone}</p>
            </div>
          </section>
        )}

        {/* Commission invoices for this listing */}
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-ink">Commission invoices</h2>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            {listingInvoices.length === 0 ? (
              <p className="px-5 py-6 text-sm text-inkmuted">No invoices issued for this listing yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-bg text-xs font-medium text-inkmuted">
                    <th className="px-5 py-3">Invoice no.</th>
                    <th className="px-5 py-3">Basis</th>
                    <th className="px-5 py-3">Rate</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Issued</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {listingInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-bg">
                      <td className="px-5 py-3 font-data text-ink">{inv.invoiceNo}</td>
                      <td className="px-5 py-3 font-data text-ink">{formatCurrency(inv.basis)}</td>
                      <td className="px-5 py-3 font-data text-ink">{(inv.rate * 100).toFixed(1)}%</td>
                      <td className="px-5 py-3 font-data text-ink">{formatCurrency(inv.amount)}</td>
                      <td className="px-5 py-3 text-ink">{formatDate(inv.issuedDate)}</td>
                      <td className="px-5 py-3">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Documents for this listing */}
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-ink">Documents</h2>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            {listingDocuments.length === 0 ? (
              <p className="px-5 py-6 text-sm text-inkmuted">No documents uploaded for this listing yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {listingDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm text-ink">{doc.name}</p>
                      <p className="text-xs capitalize text-inkmuted">
                        {doc.type.replace("-", " ")} · uploaded {formatDate(doc.uploadedDate)}
                      </p>
                    </div>
                    <span className="font-data text-xs text-inkmuted">{doc.sizeKb} KB</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3">
      <p className="text-[11px] font-medium text-inkmuted">{label}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
