import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { complete, disclaimer, logLlmRequest } from "@/lib/llm";
import { db } from "@/lib/db";
import { requireDealAccess } from "@/lib/llm-api";

const schema = z.object({ dealId: z.string(), notes: z.string().min(10) });

function heuristicTasks(notes: string) {
  return notes.split("\n").filter((l) => /todo|action|follow up|next/i.test(l)).slice(0, 5).map((line) => ({ title: line.replace(/^[-*\d.\s]+/, "").slice(0, 120) }));
}

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  const prompt = `Extract actionable tasks from meeting notes as bullets with owner and due date assumptions.\n${parsed.data.notes}`;
  const out = await complete(prompt, "fast");
  const tasks = heuristicTasks(parsed.data.notes);
  for (const t of tasks) {
    await db.task.create({ data: { dealId: scoped.deal.id, title: t.title, priority: "medium", status: "todo" } });
  }

  await logLlmRequest({ organizationId: scoped.auth.session.organizationId, dealId: scoped.deal.id, userId: scoped.auth.session.userId, feature: "meeting_notes_tasks", model: out.model, prompt, responseText: out.text, responseJson: { tasks }, confidence: tasks.length ? 0.7 : 0.45, inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens });

  return NextResponse.json({ extracted: out.text, tasksCreated: tasks.length, tasks, disclaimer: disclaimer() });
}
