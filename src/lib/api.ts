import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireSession() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  // Refresh critical auth fields from DB to avoid stale-cookie issues after reseed/reset.
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, organizationId: true, role: true, email: true, name: true },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 }) };
  }

  return {
    session: {
      ...session,
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
}

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { error: NextResponse.json({ error: parsed.error.flatten() }, { status: 400 }) };
  }
  return { data: parsed.data };
}
