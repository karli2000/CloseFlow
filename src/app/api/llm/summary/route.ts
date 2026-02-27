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

  const prompt = `Create concise closing deal summary with confidence 0-1 and 3 bullets for next steps.\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "fast");
  const confidence = 0.76;
  const record = await logLlmRequest({
    organizationId: scoped.auth.session.organizationId,
    dealId: scoped.deal.id,
    userId: scoped.auth.session.userId,
    feature: "deal_summary",
    model: out.model,
    prompt,
    responseText: out.text,
    confidence,
    inputTokens: out.usage.inputTokens,
    outputTokens: out.usage.outputTokens,
  });

  return NextResponse.json({ summary: out.text, confidence, disclaimer: disclaimer(), requestId: record.id, mocked: out.mocked });
}
