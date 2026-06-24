import { documents, listings, formatDate } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { DocumentType } from "@/lib/types";
import Link from "next/link";

const typeLabels: Record<DocumentType, string> = {
  "broker-agreement": "Broker agreement",
  "listing-ad": "Listing ad",
  invoice: "Invoice",
  "title-deed": "Title deed",
  valuation: "Valuation",
  "tax-receipt": "Tax receipt",
  other: "Other",
};

const typeColors: Record<DocumentType, string> = {
  "broker-agreement": "bg-primary-light text-primary-dark",
  "listing-ad": "bg-gold-light text-gold",
  invoice: "bg-signal-light text-signal",
  "title-deed": "bg-gold-light text-gold",
  valuation: "bg-bg text-inkmuted",
  "tax-receipt": "bg-bg text-inkmuted",
  other: "bg-bg text-inkmuted",
};

export default function DocumentsPage() {
  const byType = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.type] = (acc[d.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle={`${documents.length} files across all listings`}
        action={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Upload document
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 px-8 py-6">
        {Object.entries(byType).map(([type, count]) => (
          <span
            key={type}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${typeColors[type as DocumentType]}`}
          >
            {typeLabels[type as DocumentType]} · {count}
          </span>
        ))}
      </div>

      <div className="px-8 pb-10">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-bg text-xs font-medium text-inkmuted">
                <th className="px-5 py-3">Document</th>
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Uploaded</th>
                <th className="px-5 py-3">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {documents.map((doc) => {
                const listing = listings.find((l) => l.id === doc.listingId);
                return (
                  <tr key={doc.id} className="hover:bg-bg">
                    <td className="px-5 py-4 text-ink">{doc.name}</td>
                    <td className="px-5 py-4">
                      <Link href={`/listings/${listing?.id}`} className="text-ink hover:text-primary">
                        {listing?.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[doc.type]}`}
                      >
                        {typeLabels[doc.type]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink">{formatDate(doc.uploadedDate)}</td>
                    <td className="px-5 py-4 font-data text-ink">{doc.sizeKb} KB</td>
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
