"use client";

import Link from "next/link";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function MobileMenu({
  loggedIn,
  name,
  role,
  locale,
}: {
  loggedIn: boolean;
  name?: string;
  role?: string;
  locale: "en" | "de";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm sm:hidden">
        Menu
      </button>

      {open && (
        <>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40" />
          <aside className="fixed inset-y-0 right-0 z-50 w-72 border-l border-slate-200 bg-white p-4 shadow-2xl sm:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-900">Menu</p>
              <button onClick={() => setOpen(false)} className="rounded border px-2 py-1 text-xs">Close</button>
            </div>

            <div className="mb-3">
              <LocaleSwitcher current={locale} />
            </div>

            <nav className="flex flex-col gap-1 text-sm text-slate-700">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded px-2 py-2 hover:bg-slate-100">Workspace</Link>
              <Link href="/guide" onClick={() => setOpen(false)} className="rounded px-2 py-2 hover:bg-slate-100">Guide</Link>
              <Link href="/about" onClick={() => setOpen(false)} className="rounded px-2 py-2 hover:bg-slate-100">About</Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="rounded px-2 py-2 hover:bg-slate-100">FAQ</Link>

              {loggedIn ? (
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  Logged in: {name} ({role})
                </div>
              ) : null}

              <hr className="my-2" />

              {loggedIn ? (
                <form action="/api/auth/logout" method="post">
                  <button className="w-full rounded px-2 py-2 text-left hover:bg-slate-100">Logout</button>
                </form>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="rounded px-2 py-2 hover:bg-slate-100">Sign in</Link>
              )}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
