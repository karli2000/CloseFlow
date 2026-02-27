import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { requireDealAccess } from "@/lib/llm-api";
import { searchChunks } from "@/lib/retrieval";

const schema = z.object({ dealId: z.string(), question: z.string().min(3) });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const citations = await searchChunks(scoped.deal.id, parsed.data.question, 6);
  const prompt = `Answer strictly from provided sources. If unknown, say so.\nQuestion: ${parsed.data.question}\nSources:\n${citations.map((c, i) => `[${i + 1}] ${c.source}: ${c.snippet}`).join("\n")}`;
  const out = await complete(prompt, "strong");
  await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "document_qa", model: out.model, prompt, responseText: out.text, responseJson: { citations }, citations, confidence: citations.length ? 0.74 : 0.3, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ answer: out.text, citations, confidence: citations.length ? 0.74 : 0.3, disclaimer: disclaimer() });
}
