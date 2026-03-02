import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseBody, requireSession } from "@/lib/api";
import { uploadToS3 } from "@/lib/s3";

export const runtime = "nodejs";

const schema = z.object({ dealId: z.string(), name: z.string(), required: z.boolean().optional(), uploaded: z.boolean().optional() });

export async function GET() {
  const auth = await requireSession();
  if (auth.error) return auth.error;
  const rows = await db.document.findMany({
    where: { deal: { organizationId: auth.session.organizationId } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const contentType = req.headers.get("content-type") || "";

  // Simple JSON mode (existing behavior)
  if (!contentType.includes("multipart/form-data")) {
    const parsed = parseBody(schema, await req.json());
    if (parsed.error) return parsed.error;
    const row = await db.document.create({ data: parsed.data });
    return NextResponse.json(row, { status: 201 });
  }

  // Upload mode: multipart { dealId, file }
  const form = await req.formData();
  const dealId = String(form.get("dealId") || "");
  const file = form.get("file") as File | null;

  if (!dealId || !file) {
    return NextResponse.json({ error: "dealId and file are required" }, { status: 400 });
  }

  const deal = await db.deal.findFirst({ where: { id: dealId, organizationId: auth.session.organizationId } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const key = `${auth.session.organizationId}/${dealId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  let storage: { bucket: string; key: string; url: string } | null = null;
  try {
    storage = await uploadToS3(key, bytes, file.type || "application/octet-stream");
  } catch (e) {
    return NextResponse.json({ error: `Upload failed: ${(e as Error).message}` }, { status: 500 });
  }

  const row = await db.document.create({
    data: {
      dealId,
      name: file.name,
      required: true,
      uploaded: true,
      uploadedAt: new Date(),
      metadata: {
        storage: "s3",
        bucket: storage.bucket,
        key: storage.key,
        url: storage.url,
        contentType: file.type,
        size: file.size,
      },
    },
  });

  return NextResponse.json({ ok: true, document: row, fileUrl: storage.url }, { status: 201 });
}
