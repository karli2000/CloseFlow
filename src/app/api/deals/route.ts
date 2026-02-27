import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ title: z.string().min(2), status: z.enum(["lead", "active", "closing", "closed"]).optional(), targetCloseAt: z.string().optional(), value: z.number().optional() });

export async function GET() {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const deals = await db.deal.findMany({ where: { organizationId: auth.session.organizationId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(deals);
}

export async function POST(req: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;

  const created = await db.deal.create({
    data: {
      title: parsed.data.title,
      status: parsed.data.status,
      value: parsed.data.value,
      targetCloseAt: parsed.data.targetCloseAt ? new Date(parsed.data.targetCloseAt) : undefined,
      organizationId: auth.session.organizationId,
      ownerId: auth.session.userId,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
