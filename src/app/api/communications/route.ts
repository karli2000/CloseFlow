import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ dealId: z.string(), channel: z.string(), summary: z.string() });

export async function GET() {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const rows = await db.communication.findMany({ where: { deal: { organizationId: auth.session.organizationId } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json()); if (parsed.error) return parsed.error;
  const row = await db.communication.create({ data: { ...parsed.data, userId: auth.session.userId } });
  return NextResponse.json(row, { status: 201 });
}
