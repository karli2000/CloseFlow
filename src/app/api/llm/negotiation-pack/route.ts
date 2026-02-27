import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { formatDealContext } from "@/lib/deal-context";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string(), objective: z.string().default("close on schedule") });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const prompt = `Build a negotiation prep pack with: priorities, BATNA, likely objections, fallback concessions, opener and close. Objective: ${parsed.data.objective}.\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "strong");
  await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "negotiation_prep", model: out.model, prompt, responseText: out.text, confidence: 0.68, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ pack: out.text, confidence: 0.68, disclaimer: disclaimer() });
}
