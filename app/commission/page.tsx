import { invoices, listings, formatCurrency, formatDate } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { InvoiceStatusBadge } from "@/components/Badges";
import Link from "next/link";

export default function CommissionPage() {
  const earned = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const proforma = invoices.filter((i) => i.status === "proforma").reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const sorted = [...invoices].sort((a, b) => {
    const order = { overdue: 0, proforma: 1, issued: 2, paid: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <div>
      <PageHeader
        title="Commission"
        subtitle="Commission invoices across all listings"
        action={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            New invoice
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-3">
        <SummaryCard label="Earned" value={formatCurrency(earned)} tone="primary" />
        <SummaryCard label="Proforma (awaiting sale completion)" value={formatCurrency(proforma)} tone="gold" />
        <SummaryCard label="Overdue" value={formatCurrency(overdue)} tone="signal" />
      </div>

      <div className="px-8 pb-10">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-bg text-xs font-medium text-inkmuted">
                <th className="px-5 py-3">Invoice no.</th>
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Basis</th>
                <th className="px-5 py-3">Rate</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sorted.map((inv) => {
                const listing = listings.find((l) => l.id === inv.listingId);
                return (
                  <tr key={inv.id} className="hover:bg-bg">
                    <td className="px-5 py-4 font-data font-medium text-ink">{inv.invoiceNo}</td>
                    <td className="px-5 py-4">
                      <Link href={`/listings/${listing?.id}`} className="text-ink hover:text-primary">
                        {listing?.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-data text-ink">{formatCurrency(inv.basis)}</td>
                    <td className="px-5 py-4 font-data text-ink">{(inv.rate * 100).toFixed(1)}%</td>
                    <td className="px-5 py-4 font-data text-ink">{formatCurrency(inv.amount)}</td>
                    <td className="px-5 py-4 text-ink">{formatDate(inv.issuedDate)}</td>
                    <td className="px-5 py-4">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "gold" | "signal";
}) {
  const colors = {
    primary: "text-primary-dark",
    gold: "text-gold",
    signal: "text-signal",
  };
  return (
    <div className="rounded-lg border border-line bg-surface px-5 py-4">
      <p className="text-xs font-medium text-inkmuted">{label}</p>
      <p className={`font-data mt-1.5 text-2xl font-semibold ${colors[tone]}`}>{value}</p>
    </div>
  );
}
