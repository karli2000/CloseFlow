import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Impressum</h1>
        <div className="mt-6 space-y-3 text-slate-700">
          <p><strong>Dienstanbieter:</strong> CloseFlow GmbH (Platzhalter)</p>
          <p><strong>Anschrift:</strong> Musterstraße 1, 1010 Wien, Österreich</p>
          <p><strong>E-Mail:</strong> legal@closeflow.example</p>
          <p><strong>Vertretungsberechtigt:</strong> Max Mustermann</p>
          <p><strong>Firmenbuch / UID:</strong> FN XXXXX / ATUXXXXXX</p>
          <p className="mt-6 text-sm text-slate-500">
            Hinweis: Diese Angaben sind Platzhalter und müssen vor produktivem Betrieb durch die korrekten Firmendaten ersetzt werden.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
