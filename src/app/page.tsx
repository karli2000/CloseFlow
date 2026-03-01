import Link from "next/link";
import { readSession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function HomePage() {
  const session = await readSession();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <img src="/logo.svg" alt="CloseFlow" className="mb-8 h-14 w-auto" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Keep every real-estate closing on track.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          A minimal workflow platform for deal teams: deadlines, documents, follow-ups and AI-assisted next steps.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">Open dashboard</Link>
              <Link href="/deals" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-100">View deals</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">Sign in</Link>
              <Link href="/login" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-100">Get started</Link>
            </>
          )}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Feature title="Deadline Sentinel" text="Never miss 48h / 24h / overdue milestones." />
          <Feature title="Missing-Docs Chaser" text="Auto-detects missing documents and creates follow-ups." />
          <Feature title="Closing Readiness" text="Score + blockers so teams know what to do next." />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-600">{text}</p></div>;
}
