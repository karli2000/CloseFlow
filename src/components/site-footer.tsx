import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CloseFlow</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/impressum" className="hover:text-slate-900">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-slate-900">Datenschutz</Link>
          <Link href="/cookies" className="hover:text-slate-900">Cookie-Richtlinie</Link>
        </div>
      </div>
    </footer>
  );
}
