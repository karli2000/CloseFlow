import Link from "next/link";
import { readSession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function AppHeader() {
  const session = await readSession();
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-mark.svg" alt="CloseFlow" className="h-7 w-7" />
            <span className="font-semibold text-slate-900">CloseFlow</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher current={locale} />
            {session ? (
              <form action="/api/auth/logout" method="post">
                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Logout</button>
              </form>
            ) : (
              <Link href="/login" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700">Sign in</Link>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <Link href="/dashboard" className="hover:text-slate-900">Workspace</Link>
          <Link href="/guide" className="hover:text-slate-900">Guide</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
          {session ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
              Logged in: {session.name} ({session.role})
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
