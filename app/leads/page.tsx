import { PageHeader } from "@/components/PageHeader";
import { LeadStatusBadge, LeadSourceTag } from "@/components/Badges";
import { getAllLeads } from "@/lib/leads-store";
import { getLeadsSorted, formatDateTime } from "@/lib/data";

// Always fetch fresh — leads can arrive at any moment from the public site.
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { leads, live } = await getAllLeads();
  const sorted = getLeadsSorted(leads);
  const newCount = sorted.filter((l) => l.status === "new").length;

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${sorted.length} lead${sorted.length === 1 ? "" : "s"} · ${newCount} new`}
      />

      {!live && (
        <div className="mx-8 mt-6 rounded-lg border border-gold bg-gold-light px-5 py-4 text-sm text-ink">
          <p className="font-medium">Showing sample data — live capture isn&apos;t connected yet.</p>
          <p className="mt-1 text-inkmuted">
            Once Vercel KV is attached to this project (see{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-xs">SETUP_LEADS_CRM.md</code>), real
            leads submitted on the website will appear here automatically.
          </p>
        </div>
      )}

      <div className="px-8 py-6">
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-line bg-surface px-5 py-6">
            <p className="text-sm text-inkmuted">
              No leads yet. New submissions from the &quot;List Your Property&quot; form, the buyer/tenant
              enquiry form, and the chatbot will appear here as they come in.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-bg text-xs font-medium uppercase tracking-wide text-inkmuted">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Interest</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Received</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{lead.name}</p>
                      {lead.intent && (
                        <p className="mt-0.5 text-xs capitalize text-inkmuted">{lead.intent}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-inkmuted">
                      {lead.email && <p>{lead.email}</p>}
                      {lead.phone && <p>{lead.phone}</p>}
                    </td>
                    <td className="px-5 py-4 text-inkmuted">
                      {lead.interest && <p>{lead.interest}</p>}
                      {lead.location && <p className="text-xs">{lead.location}</p>}
                      {lead.budgetOrPrice && <p className="text-xs">{lead.budgetOrPrice}</p>}
                      {lead.message && (
                        <p className="mt-1 max-w-xs text-xs italic text-inkmuted">&ldquo;{lead.message}&rdquo;</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <LeadSourceTag source={lead.source} />
                    </td>
                    <td className="px-5 py-4 text-xs text-inkmuted">{formatDateTime(lead.receivedDate)}</td>
                    <td className="px-5 py-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
