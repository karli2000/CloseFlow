import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ title: z.string().optional(), status: z.enum(["lead", "active", "closing", "closed"]).optional(), targetCloseAt: z.string().nullable().optional(), value: z.number().nullable().optional() });

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const { id } = await params;
  const deal = await db.deal.findFirst({
    where: { id, organizationId: auth.session.organizationId },
    include: { parties: true, tasks: true, milestones: true, documents: true, communications: true, events: true },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json()); if (parsed.error) return parsed.error;
  const { id } = await params;
  const deal = await db.deal.update({ where: { id }, data: {
    title: parsed.data.title,
    status: parsed.data.status,
    value: parsed.data.value ?? undefined,
    targetCloseAt: parsed.data.targetCloseAt ? new Date(parsed.data.targetCloseAt) : parsed.data.targetCloseAt === null ? null : undefined,
  }});
  return NextResponse.json(deal);
}
