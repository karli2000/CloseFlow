import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Cookie-Richtlinie</h1>
        <div className="mt-6 space-y-4 text-slate-700">
          <p>
            CloseFlow verwendet technisch notwendige Cookies zur Anmeldung, Sicherheit und Sitzungsverwaltung.
          </p>
          <h2 className="text-xl font-semibold">Notwendige Cookies</h2>
          <p>Ohne diese Cookies kann die Plattform nicht korrekt betrieben werden (z. B. Authentifizierungs-Cookie).</p>

          <h2 className="text-xl font-semibold">Optionale Cookies</h2>
          <p>
            Analyse- oder Marketing-Cookies werden nur nach Einwilligung gesetzt. In dieser MVP-Version sind standardmäßig keine
            Marketing-Cookies aktiviert.
          </p>

          <h2 className="text-xl font-semibold">Verwaltung</h2>
          <p>Du kannst Cookies im Browser löschen oder blockieren. Das kann die Funktionalität einschränken.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
