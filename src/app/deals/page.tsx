import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { CreateDealForm } from "@/components/create-deal-form";

export default async function DealsPage() {
  const session = await readSession();
  if (!session) redirect('/login');
  const t = await getDictionary();
  const deals = await db.deal.findMany({ where: { organizationId: session.organizationId }, orderBy: { updatedAt: "desc" } });

  return (
    <main>
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-4 sm:px-6">
        <h1 className="text-2xl font-semibold">{t.dealsTitle}</h1>
        <p className="text-sm text-slate-600">{t.dealsHowToAdd}</p>

        <CreateDealForm
          labels={{
            title: t.dealsCreateTitle,
            cta: t.dealsCreateCta,
            name: t.dealsCreateName,
            status: t.dealsCreateStatus,
            value: t.dealsCreateValue,
            targetDate: t.dealsCreateTargetDate,
            success: t.createSuccess,
            error: t.createError,
          }}
        />

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
