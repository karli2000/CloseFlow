import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { formatDealContext } from "@/lib/deal-context";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string() });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const overdue = scoped.deal.targetCloseAt && scoped.deal.targetCloseAt < new Date();
  const prompt = `Deal rescue mode. Build 48-hour stabilization plan, escalation matrix, and communication cadence. Overdue=${Boolean(overdue)}\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "strong");
  await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "deal_rescue", model: out.model, prompt, responseText: out.text, confidence: overdue ? 0.75 : 0.6, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ overdue: Boolean(overdue), rescuePlan: out.text, confidence: overdue ? 0.75 : 0.6, disclaimer: disclaimer() });
}
