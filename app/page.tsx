import { listings, invoices, formatCurrency, formatDate } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ListingStatusBadge, InvoiceStatusBadge, FolioTag } from "@/components/Badges";
import Link from "next/link";

export default function OverviewPage() {
  const activeListings = listings.filter((l) => l.status === "active" || l.status === "under-offer");
  const closedListings = listings.filter((l) => l.status === "sold" || l.status === "let");

  const pipelineValue = activeListings.reduce((sum, l) => sum + l.askingPrice, 0);
  const pipelineCommission = activeListings.reduce(
    (sum, l) => sum + l.askingPrice * l.commissionRate,
    0
  );

  const commissionEarned = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const commissionOutstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((s, i) => s + i.amount, 0);

  const needsAttention = invoices.filter((i) => i.status === "proforma" || i.status === "overdue");

  return (
    <div>
      <PageHeader
        title="Brokerage overview"
        subtitle={`${listings.length} listings · ${activeListings.length} active · ${formatDate(new Date().toISOString())}`}
      />

      <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active pipeline"
          value={formatCurrency(pipelineValue)}
          detail={`${activeListings.length} listings on the market`}
        />
        <StatCard
          label="Potential commission"
          value={formatCurrency(pipelineCommission)}
          detail="If all active listings close"
        />
        <StatCard
          label="Commission earned"
          value={formatCurrency(commissionEarned)}
          detail={`${invoices.filter((i) => i.status === "paid").length} invoices paid`}
          tone="primary"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(commissionOutstanding)}
          detail={`${needsAttention.length} invoice${needsAttention.length === 1 ? "" : "s"} pending or overdue`}
          tone="signal"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 px-8 pb-10 lg:grid-cols-3">
        {/* Invoices needing attention */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-ink">Needs attention</h2>
          <div className="rounded-lg border border-line bg-surface">
            {needsAttention.length === 0 ? (
              <p className="px-5 py-6 text-sm text-inkmuted">
                No proforma or overdue invoices right now. New items will appear here as deals close.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {needsAttention.map((inv) => {
                  const listing = listings.find((l) => l.id === inv.listingId);
                  return (
                    <li key={inv.id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-ink">{listing?.title}</p>
                        <p className="text-xs text-inkmuted">
                          Invoice {inv.invoiceNo} · issued {formatDate(inv.issuedDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-data text-sm text-ink">{formatCurrency(inv.amount)}</span>
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Listings quick list */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Listings</h2>
            <Link href="/listings" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="rounded-lg border border-line bg-surface">
            <ul className="divide-y divide-line">
              {listings.map((l) => (
                <li key={l.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{l.title}</p>
                    <ListingStatusBadge status={l.status} />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <FolioTag folio={l.folio} />
                    <span className="text-xs text-inkmuted">{formatCurrency(l.askingPrice)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "primary" | "signal";
}) {
  const valueColor =
    tone === "primary" ? "text-primary-dark" : tone === "signal" ? "text-signal" : "text-ink";
  return (
    <div className="rounded-lg border border-line bg-surface px-5 py-4">
      <p className="text-xs font-medium text-inkmuted">{label}</p>
      <p className={`font-data mt-1.5 text-2xl font-semibold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-inkmuted">{detail}</p>
    </div>
  );
}
