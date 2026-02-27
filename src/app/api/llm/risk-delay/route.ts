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

  const overdueTasks = scoped.deal.tasks.filter((t) => t.dueAt && t.dueAt < new Date() && t.status !== "done").length;
  const missingDocs = scoped.deal.documents.filter((d) => d.required && !d.uploaded).length;
  const riskScore = Math.min(0.95, Number((0.2 + overdueTasks * 0.18 + missingDocs * 0.12).toFixed(2)));

  const prompt = `Predict closing delay risk and list top risks with mitigations.\nHeuristic risk=${riskScore}\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "strong");
  await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "risk_delay_predictor", model: out.model, prompt, responseText: out.text, confidence: riskScore, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ riskScore, analysis: out.text, disclaimer: disclaimer() });
}
