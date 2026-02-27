import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { readinessScore } from "@/lib/score";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { formatDealContext } from "@/lib/deal-context";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string() });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;
  const score = readinessScore({ deal: scoped.deal, tasks: scoped.deal.tasks, milestones: scoped.deal.milestones, documents: scoped.deal.documents });

  const prompt = `Explain closing readiness score ${score}/100 with blockers and what to fix first.\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "fast");
  const rec = await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "readiness_explanation", model: out.model, prompt, responseText: out.text, confidence: score / 100, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ readinessScore: score, explanation: out.text, confidence: Number((score / 100).toFixed(2)), disclaimer: disclaimer(), requestId: rec.id });
}
