import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/api";
import { getDealContext } from "@/lib/deal-context";

export const dealSchema = z.object({ dealId: z.string().min(4) });

export async function requireDealAccess(dealId: string) {
  const auth = await requireSession();
  if (auth.error) return { error: auth.error };

  const deal = await getDealContext(dealId);
  if (!deal || deal.organizationId !== auth.session.organizationId) {
    return { error: NextResponse.json({ error: "Deal not found" }, { status: 404 }) };
  }

  return { auth, deal };
}
