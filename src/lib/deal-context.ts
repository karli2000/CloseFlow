import { db } from "@/lib/db";

export async function getDealContext(dealId: string) {
  const deal = await db.deal.findUnique({
    where: { id: dealId },
    include: {
      parties: true,
      tasks: true,
      milestones: true,
      documents: true,
      communications: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  return deal;
}

export function formatDealContext(deal: NonNullable<Awaited<ReturnType<typeof getDealContext>>>) {
  return JSON.stringify({
    title: deal.title,
    status: deal.status,
    targetCloseAt: deal.targetCloseAt,
    value: deal.value,
    tasks: deal.tasks.map((t) => ({ title: t.title, status: t.status, dueAt: t.dueAt, priority: t.priority })),
    milestones: deal.milestones.map((m) => ({ name: m.name, status: m.status, dueAt: m.dueAt })),
    documents: deal.documents.map((d) => ({ name: d.name, required: d.required, uploaded: d.uploaded })),
    parties: deal.parties.map((p) => ({ name: p.name, type: p.type })),
    communications: deal.communications.map((c) => ({ channel: c.channel, summary: c.summary })),
  }, null, 2);
}
