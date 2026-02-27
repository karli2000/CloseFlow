import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";

const schema = z.object({ dealId: z.string(), name: z.string(), type: z.string(), email: z.string().optional(), phone: z.string().optional() });

export async function GET() {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parties = await db.party.findMany({ where: { deal: { organizationId: auth.session.organizationId } } });
  return NextResponse.json(parties);
}

export async function POST(req: Request) {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const parsed = parseBody(schema, await req.json()); if (parsed.error) return parsed.error;
  const party = await db.party.create({ data: parsed.data });
  return NextResponse.json(party, { status: 201 });
}
