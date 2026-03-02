import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { DealAssistantWorkspace } from "@/components/deal-assistant-workspace";

export default async function DashboardPage() {
  const session = await readSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold">Close a deal faster</h1>
        <p className="mb-6 text-slate-600">
          CloseFlow is now focused on one job: collect deal documents and give you clear AI guidance for next steps.
        </p>
        <DealAssistantWorkspace />
      </div>
    </main>
  );
}
