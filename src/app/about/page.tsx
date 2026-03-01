import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">About CloseFlow</h1>
        <p className="mt-4 text-slate-700">
          CloseFlow helps real-estate teams coordinate closings: milestones, missing documents, reminders,
          and action-focused summaries in one place.
        </p>
        <p className="mt-4 text-slate-700">
          Our goal is simple: fewer delays, less manual follow-up, and better transparency for everyone involved in a deal.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
