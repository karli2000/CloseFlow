import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api";
import { db } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const { id } = await params;

  const s = await db.llmSuggestion.findUnique({ where: { id }, include: { deal: true } });
  if (!s || s.deal.organizationId !== auth.session.organizationId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const cfg = await db.llmConfig.findUnique({ where: { organizationId: auth.session.organizationId } });
  const template = (s.payload as { template?: string } | null)?.template;
  const templateAllowed = !template || Boolean(cfg?.whitelistedTemplates.includes(template));

  if (cfg?.approvalRequired && s.status !== "approved") {
    return NextResponse.json({ error: "Approval required" }, { status: 400 });
  }
  if (!templateAllowed) return NextResponse.json({ error: "Template not whitelisted" }, { status: 400 });

  await db.communication.create({ data: { dealId: s.dealId, userId: auth.session.userId, channel: "llm_send", summary: s.content.slice(0, 1000) } });
  const updated = await db.llmSuggestion.update({ where: { id }, data: { status: "sent", sentAt: new Date() } });
  await db.llmAuditLog.create({ data: { organizationId: auth.session.organizationId, dealId: s.dealId, userId: auth.session.userId, action: "llm_suggestion_sent", payload: { suggestionId: id } } });

  return NextResponse.json(updated);
}
