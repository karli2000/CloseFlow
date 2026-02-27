import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ dealId: z.string(), title: z.string(), dueAt: z.string().optional(), status: z.enum(["todo", "in_progress", "done"]).optional(), priority: z.enum(["low", "medium", "high"]).optional(), assigneeId: z.string().optional() });

export async function GET() {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const rows = await db.task.findMany({ where: { deal: { organizationId: auth.session.organizationId } }, orderBy: { dueAt: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json()); if (parsed.error) return parsed.error;
  const row = await db.task.create({ data: { ...parsed.data, dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined } });
  return NextResponse.json(row, { status: 201 });
}
