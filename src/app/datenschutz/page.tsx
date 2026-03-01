import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Datenschutzerklärung (DSGVO)</h1>
        <div className="mt-6 space-y-4 text-slate-700">
          <p>
            Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen (DSGVO, TKG).
          </p>
          <h2 className="text-xl font-semibold">1. Verantwortlicher</h2>
          <p>CloseFlow GmbH (Platzhalter), Musterstraße 1, 1010 Wien, legal@closeflow.example</p>

          <h2 className="text-xl font-semibold">2. Verarbeitete Daten</h2>
          <p>Account-Daten, Deal-/Dokumenten-Metadaten, Nutzungs- und Logdaten zur Bereitstellung der Plattform.</p>

          <h2 className="text-xl font-semibold">3. Zweck und Rechtsgrundlage</h2>
          <p>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), berechtigtes Interesse (lit. f), ggf. Einwilligung (lit. a).</p>

          <h2 className="text-xl font-semibold">4. Speicherdauer</h2>
          <p>Daten werden nur so lange gespeichert, wie es für den Zweck notwendig ist oder gesetzliche Pflichten bestehen.</p>

          <h2 className="text-xl font-semibold">5. Betroffenenrechte</h2>
          <p>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde bei der Datenschutzbehörde.</p>

          <h2 className="text-xl font-semibold">6. Auftragsverarbeiter</h2>
          <p>Hosting/Cloud/Kommunikationsdienste werden als Auftragsverarbeiter mit entsprechenden Verträgen eingesetzt.</p>

          <p className="text-sm text-slate-500">
            Hinweis: Diese Seite ist eine Vorlage und ersetzt keine Rechtsberatung. Bitte vor Go-Live rechtlich prüfen lassen.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
