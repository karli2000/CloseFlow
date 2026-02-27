import { startOfDay } from "date-fns";
import { db } from "@/lib/db";
import { readinessScore } from "@/lib/score";

export async function runDeadlineSentinel(organizationId: string) {
  const now = new Date();
  const deals = await db.deal.findMany({
    where: { organizationId, status: { not: "closed" }, targetCloseAt: { not: null } },
  });
  const created: string[] = [];

  for (const deal of deals) {
    if (!deal.targetCloseAt) continue;
    const hours = (deal.targetCloseAt.getTime() - now.getTime()) / 36e5;
    const band = hours < 0 ? "overdue" : hours <= 24 ? "24h" : hours <= 48 ? "48h" : null;
    if (!band) continue;
    const day = startOfDay(now).toISOString().slice(0, 10);
    const dedupeKey = `${deal.id}:${band}:${day}`;
    try {
      await db.automationRun.create({
        data: {
          kind: "deadline_sentinel",
          dealId: deal.id,
          dedupeKey,
          result: { message: `Deal ${deal.title} is in ${band} band`, band },
        },
      });
      created.push(dedupeKey);
    } catch {
      // deduped
    }
  }

  return { createdCount: created.length, created };
}

export async function runMissingDocumentChaser(organizationId: string) {
  const deals = await db.deal.findMany({
    where: { organizationId, status: { not: "closed" } },
    include: { documents: true },
  });

  const chased = deals
    .map((deal) => ({ dealId: deal.id, title: deal.title, missing: deal.documents.filter((d) => d.required && !d.uploaded) }))
    .filter((x) => x.missing.length > 0);

  await Promise.all(
    chased.map((x) =>
      db.automationRun.create({
        data: {
          kind: "missing_document_chaser",
          dealId: x.dealId,
          dedupeKey: `${x.dealId}:${startOfDay(new Date()).toISOString().slice(0, 10)}`,
          result: { missing: x.missing.map((m) => m.name) },
        },
      }).catch(() => null),
    ),
  );

  return { chasedCount: chased.length, chased: chased.map((x) => ({ ...x, missing: x.missing.length })) };
}

export async function runClosingReadinessBrief(organizationId: string) {
  const deals = await db.deal.findMany({
    where: { organizationId },
    include: { tasks: true, milestones: true, documents: true },
  });

  const brief = deals.map((deal) => ({
    dealId: deal.id,
    title: deal.title,
    score: readinessScore({ deal, tasks: deal.tasks, milestones: deal.milestones, documents: deal.documents }),
  }));

  await db.automationRun.create({
    data: {
      kind: "closing_readiness_brief",
      dedupeKey: startOfDay(new Date()).toISOString().slice(0, 10),
      result: { brief },
    },
  }).catch(() => null);

  return { brief };
}
