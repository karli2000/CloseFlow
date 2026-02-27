import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { requireDealAccess } from "@/lib/llm-api";
import { indexDealDocuments } from "@/lib/retrieval";
import { db } from "@/lib/db";

const schema = z.object({ dealId: z.string(), extras: z.array(z.object({ name: z.string(), text: z.string() })).optional() });

export async function POST(req: Request) {
  const parsed = parseBody(schema, await req.json());
  if (parsed.error) return parsed.error;
  const scoped = await requireDealAccess(parsed.data.dealId);
  if (scoped.error) return scoped.error;

  if (parsed.data.extras?.length) {
    for (const item of parsed.data.extras) {
      await db.document.create({ data: { dealId: scoped.deal.id, name: item.name, required: false, uploaded: true, uploadedAt: new Date(), textContent: item.text, metadata: { source: "manual" } } });
    }
  }

  const result = await indexDealDocuments(scoped.deal.id);
  return NextResponse.json({ ok: true, ...result });
}
