import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const { id } = await params;

  const s = await db.llmSuggestion.findUnique({ where: { id }, include: { deal: true } });
  if (!s || s.deal.organizationId !== auth.session.organizationId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.llmSuggestion.update({ where: { id }, data: { status: "approved", approvedAt: new Date(), approvedById: auth.session.userId } });
  await db.llmAuditLog.create({ data: { organizationId: auth.session.organizationId, dealId: s.dealId, userId: auth.session.userId, action: "llm_suggestion_approved", payload: { suggestionId: id } } });
  return NextResponse.json(updated);
}
