import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const faqs = [
  {
    q: "What does CloseFlow automate?",
    a: "Deadline reminders, missing-document follow-ups, and closing readiness summaries.",
  },
  {
    q: "Can I still review messages before sending?",
    a: "Yes. Human-in-the-loop approval is enabled by default.",
  },
  {
    q: "Which data is stored?",
    a: "Only deal-related workflow data you enter: tasks, milestones, documents, and communication logs.",
  },
  {
    q: "Is this GDPR-ready?",
    a: "CloseFlow provides privacy/legal pages and data controls, but your final legal setup depends on your deployment and contracts.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">FAQ</h1>
        <div className="mt-6 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="font-semibold">{f.q}</h2>
              <p className="mt-2 text-slate-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
