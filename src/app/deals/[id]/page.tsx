import { db } from "@/lib/db";
import { readinessScore } from "@/lib/score";
import { getDictionary } from "@/lib/i18n";
import { DealLlmPanel } from "@/components/deal-llm-panel";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getDictionary();
  const deal = await db.deal.findUnique({
    where: { id },
    include: { parties: true, tasks: true, milestones: true, documents: true, communications: true, events: true, automationRuns: { orderBy: { createdAt: "desc" }, take: 8 } },
  });
  if (!deal) return <main className="p-6">Not found</main>;

  const score = readinessScore({ deal, tasks: deal.tasks, milestones: deal.milestones, documents: deal.documents });

  return (
    <main>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="rounded-lg border bg-white p-4">
          <h1 className="text-2xl font-semibold">{deal.title}</h1>
          <p className="text-slate-500">{t.status}: {deal.status} · {t.readiness}: {score}%</p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">How to use this deal page</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Keep tasks and milestones updated to improve readiness accuracy</li>
            <li>Use the AI Copilot panel for summaries, risks and follow-up drafts</li>
            <li>Check timeline + communications before sending external updates</li>
          </ul>
        </div>

        <DealLlmPanel dealId={deal.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <Section title={t.tasksMilestones}>
            <ul className="space-y-2 text-sm">{deal.tasks.map((x) => <li key={x.id}>☐ {x.title} ({x.status})</li>)}</ul>
            <hr className="my-3" />
            <ul className="space-y-2 text-sm">{deal.milestones.map((x) => <li key={x.id}>◆ {x.name} ({x.status})</li>)}</ul>
          </Section>

          <Section title={t.docsChecklist}>
            <ul className="space-y-2 text-sm">{deal.documents.map((x) => <li key={x.id}>{x.uploaded ? "✅" : "⬜"} {x.name}</li>)}</ul>
          </Section>

          <Section title={t.timeline}>
            <ul className="space-y-2 text-sm">{deal.events.map((x) => <li key={x.id}>{new Date(x.createdAt).toLocaleString()} · {x.type}</li>)}</ul>
          </Section>

          <Section title={t.commsAutomations}>
            <ul className="space-y-2 text-sm">{deal.communications.map((x) => <li key={x.id}>{x.channel}: {x.summary}</li>)}</ul>
            <hr className="my-3" />
            <ul className="space-y-2 text-sm">{deal.automationRuns.map((x) => <li key={x.id}>{x.kind} ({new Date(x.createdAt).toLocaleDateString()})</li>)}</ul>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border bg-white p-4"><h2 className="mb-3 text-lg font-medium">{title}</h2>{children}</section>;
}
