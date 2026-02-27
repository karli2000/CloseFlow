import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, logLlmRequest } from "@/lib/llm";
import { formatDealContext } from "@/lib/deal-context";
import { db } from "@/lib/db";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string(), template: z.string().default("missing_docs_ping"), runNow: z.boolean().default(false), config: z.object({ autoFollowupEnabled: z.boolean().optional(), approvalRequired: z.boolean().optional(), whitelistedTemplates: z.array(z.string()).optional() }).optional() });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const existing = await db.llmConfig.findUnique({ where: { organizationId: scoped.auth.session.organizationId } });
  const cfg = existing ?? await db.llmConfig.create({ data: { organizationId: scoped.auth.session.organizationId, whitelistedTemplates: ["missing_docs_ping", "milestone_reminder"], approvalRequired: true } });

  if (parsed.data.config) {
    await db.llmConfig.update({ where: { id: cfg.id }, data: parsed.data.config });
  }
  const fresh = await db.llmConfig.findUniqueOrThrow({ where: { id: cfg.id } });

  const prompt = `Create a short follow-up message using template=${parsed.data.template}.\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "fast");
  const reqLog = await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "auto_followup", model: out.model, prompt, responseText: out.text, confidence: 0.65, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  const suggestion = await db.llmSuggestion.create({ data: { requestId: reqLog.id, dealId: scoped.deal.id, type: "auto_followup", title: parsed.data.template, content: out.text, payload: { template: parsed.data.template }, status: fresh.approvalRequired ? "pending_review" : "approved" } });

  const templateAllowed = fresh.whitelistedTemplates.includes(parsed.data.template);
  const canAutoSend = parsed.data.runNow && fresh.autoFollowupEnabled && templateAllowed && (!fresh.approvalRequired || suggestion.status === "approved");

  if (canAutoSend) {
    await db.communication.create({ data: { dealId: scoped.deal.id, userId: scoped.auth.session.userId, channel: "auto-followup", summary: out.text.slice(0, 1000) } });
    await db.llmSuggestion.update({ where: { id: suggestion.id }, data: { status: "sent", sentAt: new Date() } });
  }

  await db.llmAuditLog.create({ data: { organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, action: "auto_followup_evaluated", payload: { templateAllowed, canAutoSend, config: fresh } } });

  return NextResponse.json({
    suggestionId: suggestion.id,
    status: canAutoSend ? "sent" : suggestion.status,
    templateAllowed,
    autoSendEnabled: fresh.autoFollowupEnabled,
    approvalRequired: fresh.approvalRequired,
  });
}
