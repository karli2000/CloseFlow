import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api";
import { runClosingReadinessBrief, runDeadlineSentinel, runMissingDocumentChaser } from "@/lib/automations";

export async function POST() {
  const auth = await requireSession(); if (auth.error) return auth.error;
  const org = auth.session.organizationId;
  const [deadline, missingDocs, brief] = await Promise.all([
    runDeadlineSentinel(org),
    runMissingDocumentChaser(org),
    runClosingReadinessBrief(org),
  ]);
  return NextResponse.json({ deadline, missingDocs, brief });
}
