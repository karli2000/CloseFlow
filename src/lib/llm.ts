import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { LlmFeature } from "@prisma/client";
import { db } from "@/lib/db";

const fastModel = process.env.LLM_FAST_MODEL || "gpt-4o-mini";
const strongModel = process.env.LLM_STRONG_MODEL || "gpt-4o";

const openai = process.env.OPENAI_API_KEY ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export function chooseModel(strength: "fast" | "strong") {
  return strength === "fast" ? fastModel : strongModel;
}

export async function complete(prompt: string, strength: "fast" | "strong" = "fast") {
  if (!openai) {
    return {
      text: `AI provider not configured. Fallback response generated from app heuristics.\n\n${prompt.slice(0, 1200)}`,
      usage: { inputTokens: 0, outputTokens: 0 },
      model: chooseModel(strength),
      mocked: true,
    };
  }

  const model = chooseModel(strength);
  const result = await generateText({
    model: openai(model),
    prompt,
    temperature: 0.2,
  });

  const usage = result.usage as unknown as { inputTokens?: number; outputTokens?: number; promptTokens?: number; completionTokens?: number } | undefined;

  return {
    text: result.text,
    usage: {
      inputTokens: usage?.inputTokens ?? usage?.promptTokens ?? 0,
      outputTokens: usage?.outputTokens ?? usage?.completionTokens ?? 0,
    },
    model,
    mocked: false,
  };
}

export function estimateCost(inputTokens: number, outputTokens: number) {
  return Number(((inputTokens * 0.0000004) + (outputTokens * 0.0000012)).toFixed(6));
}

export async function logLlmRequest(params: {
  organizationId: string;
  dealId?: string;
  userId?: string;
  feature: LlmFeature;
  prompt: string;
  responseText?: string;
  responseJson?: unknown;
  confidence?: number;
  citations?: unknown;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  status?: string;
}) {
  const estimatedCost = estimateCost(params.inputTokens ?? 0, params.outputTokens ?? 0);

  return db.llmRequest.create({
    data: {
      organizationId: params.organizationId,
      dealId: params.dealId,
      userId: params.userId,
      feature: params.feature,
      prompt: params.prompt,
      responseText: params.responseText,
      responseJson: params.responseJson as object | undefined,
      confidence: params.confidence,
      citations: params.citations as object | undefined,
      model: params.model,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      estimatedCost,
      status: params.status ?? "ok",
    },
  });
}

export function disclaimer() {
  return "AI guidance only. Verify legal, financial, and compliance details before execution.";
}
