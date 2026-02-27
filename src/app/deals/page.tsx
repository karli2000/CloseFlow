import Link from "next/link";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { getDictionary } from "@/lib/i18n";

export default async function DealsPage() {
  const session = await readSession();
  if (!session) return null;
  const t = await getDictionary();
  const deals = await db.deal.findMany({ where: { organizationId: session.organizationId }, orderBy: { updatedAt: "desc" } });

  return (
    <main>
      <Nav />
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">{t.dealsTitle}</h1>
        <div className="space-y-3">
          {deals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`} className="block rounded border bg-white p-4">
              <div className="flex justify-between"><span>{deal.title}</span><span className="text-sm text-slate-500">{t.status}: {deal.status}</span></div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
