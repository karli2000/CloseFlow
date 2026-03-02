import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-12">
        <h1 className="text-3xl font-bold">CloseFlow in 3 steps</h1>

        <Step n="1" title="Create or select a deal">
          Go to <strong>Dashboard</strong>. Enter a deal name and click <strong>Create deal</strong>.
        </Step>

        <Step n="2" title="Upload your documents">
          Choose the deal, upload contract/loan/title documents. Files are stored in your configured
          <strong> S3-compatible storage</strong>.
        </Step>

        <Step n="3" title="Ask AI what to do next">
          Click <strong>“AI: What should I do to close this deal?”</strong>. You get a concise summary,
          readiness score, and concrete next actions.
        </Step>

        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Why use CloseFlow?</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>One simple workflow instead of many screens</li>
            <li>Document-driven AI guidance for deal closing</li>
            <li>Clear next actions, not raw JSON</li>
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-emerald-700">Step {n}</p>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-slate-700">{children}</p>
    </div>
  );
}
