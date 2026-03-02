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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Upload documents. Get clear next steps. Close the deal.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          CloseFlow helps you run one simple process: create/select a deal, upload documents to your S3 storage, and ask AI what blocks closing.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={session ? "/dashboard" : "/login"} className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">
            {session ? "Open simple workspace" : "Start now"}
          </Link>
          <Link href="/guide" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-100">See how it works</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
