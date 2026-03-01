import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { readinessScore } from "@/lib/score";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardPage() {
  const session = await readSession();
  if (!session) redirect('/login');
  const t = await getDictionary();

  const deals = await db.deal.findMany({
    where: { organizationId: session.organizationId },
    include: { tasks: true, milestones: true, documents: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <main>
      <Nav />
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">{t.dashboardTitle}</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card label={t.activeDeals} value={String(deals.length)} />
          <Card label={t.openTasks} value={String(deals.flatMap((d) => d.tasks).filter((x) => x.status !== "done").length)} />
          <Card label={t.missingDocs} value={String(deals.flatMap((d) => d.documents).filter((d) => d.required && !d.uploaded).length)} />
        </div>

        <h2 className="mt-8 mb-3 text-xl font-medium">{t.recentDeals}</h2>
        <div className="space-y-3">
          {deals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`} className="block rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{deal.title}</p>
                  <p className="text-sm text-slate-500">{deal.status}</p>
                </div>
                <p className="text-sm">{t.readiness}: {readinessScore({ deal, tasks: deal.tasks, milestones: deal.milestones, documents: deal.documents })}%</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-white p-4"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div>;
}
