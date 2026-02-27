import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { formatDealContext } from "@/lib/deal-context";
import { db } from "@/lib/db";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string(), channel: z.string().default("email"), recipient: z.string().optional(), intent: z.string().default("status update") });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const prompt = `Draft a professional ${parsed.data.channel} message about ${parsed.data.intent}. Include subject and body.\nDeal:\n${formatDealContext(scoped.deal)}`;
  const out = await complete(prompt, "fast");
  const record = await logLlmRequest({
    organizationId: scoped.auth.session.organizationId,
    dealId: scoped.deal.id,
    userId: scoped.auth.session.userId,
    feature: "message_drafting",
    model: out.model,
    prompt,
    responseText: out.text,
    confidence: 0.72,
    inputTokens: out.usage.inputTokens,
    outputTokens: out.usage.outputTokens,
  });

  const suggestion = await db.llmSuggestion.create({
    data: {
      requestId: record.id,
      dealId: scoped.deal.id,
      type: "message",
      title: `${parsed.data.channel} draft`,
      content: out.text,
      payload: { channel: parsed.data.channel, recipient: parsed.data.recipient, intent: parsed.data.intent },
    },
  });

  return NextResponse.json({ suggestionId: suggestion.id, status: suggestion.status, draft: out.text, disclaimer: `${disclaimer()} Human approval required before send.` });
}
