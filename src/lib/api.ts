import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";

export async function requireSession() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { session };
}

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { error: NextResponse.json({ error: parsed.error.flatten() }, { status: 400 }) };
  }
  return { data: parsed.data };
}
