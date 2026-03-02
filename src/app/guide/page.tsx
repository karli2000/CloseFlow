import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-bold">How CloseFlow works</h1>

        <Block title="1) Dashboard">
          The dashboard is your control center. You see active deals, open tasks, missing documents and a readiness score.
          Start here every day.
        </Block>

        <Block title="2) Deals page">
          Open a deal to manage milestones, tasks, required documents, communication history and automation runs.
          Each deal has its own workspace.
        </Block>

        <Block title="3) Readiness score">
          The score estimates how close a deal is to closing based on completed milestones, open tasks and missing documents.
          Use it to prioritize.
        </Block>

        <Block title="4) AI Copilot panel">
          In each deal you can generate: summary, draft message, readiness explanation, risk prediction,
          negotiation prep, rescue plan, and meeting-notes-to-tasks.
        </Block>

        <Block title="5) Human-in-the-loop">
          AI suggestions are drafts. You review first, then approve/send. This avoids accidental or non-compliant messages.
        </Block>

        <Block title="6) Suggested daily workflow">
          1. Open dashboard.
          <br />2. Filter deals below 80% readiness.
          <br />3. Open deal → run “Risk/Delay” and “Missing docs” checks.
          <br />4. Generate follow-up draft and send after review.
          <br />5. Run “Closing readiness explanation” before hand-off.
        </Block>
      </section>
      <SiteFooter />
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-slate-700">{children}</p>
    </div>
  );
}
