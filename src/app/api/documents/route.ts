import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ dealId: z.string(), name: z.string(), required: z.boolean().optional(), uploaded: z.boolean().optional() });

export async function GET() {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const rows = await db.document.findMany({ where: { deal: { organizationId: auth.session.organizationId } } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json()); if (parsed.error) return parsed.error;
  const row = await db.document.create({ data: parsed.data });
  return NextResponse.json(row, { status: 201 });
}
