import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-mark.svg" alt="CloseFlow" className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-wide text-slate-800">CloseFlow</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
          <Link href="/login" className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
