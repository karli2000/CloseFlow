import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { setAuthCookie, signSession, verifyPassword } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await signSession({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  await setAuthCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
