import Link from "next/link";
import { listings, formatCurrency, getClient, getAgent } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ListingStatusBadge, ListingKindBadge, FolioTag } from "@/components/Badges";

export default function ListingsPage() {
  return (
    <div>
      <PageHeader
        title="Listings"
        subtitle={`${listings.length} listings on file`}
        action={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Add listing
          </button>
        }
      />

      <div className="px-8 py-6">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-bg text-xs font-medium text-inkmuted">
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Folio</th>
                <th className="px-5 py-3">Kind</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {listings.map((l) => {
                const client = getClient(l.clientId);
                const agent = getAgent(l.agentId);
                return (
                  <tr key={l.id} className="hover:bg-bg">
                    <td className="px-5 py-4">
                      <Link href={`/listings/${l.id}`} className="font-medium text-ink hover:text-primary">
                        {l.title}
                      </Link>
                      <p className="text-xs text-inkmuted">
                        {l.address}, {l.city}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <FolioTag folio={l.folio} />
                    </td>
                    <td className="px-5 py-4">
                      <ListingKindBadge kind={l.listingKind} />
                    </td>
                    <td className="px-5 py-4 font-data text-ink">
                      {formatCurrency(l.askingPrice)}
                      {l.listingKind === "rental" && <span className="text-inkmuted">/mo</span>}
                    </td>
                    <td className="px-5 py-4 text-ink">{client?.name ?? "Unassigned"}</td>
                    <td className="px-5 py-4 text-ink">{agent?.name ?? "Unassigned"}</td>
                    <td className="px-5 py-4">
                      <ListingStatusBadge status={l.status} />
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
