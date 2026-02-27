"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LocaleSwitcher({ current }: { current: "en" | "de" }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function setLocale(locale: "en" | "de") {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button disabled={pending} onClick={() => start(() => void setLocale("en"))} className={`rounded border px-2 py-1 text-xs ${current === "en" ? "bg-slate-900 text-white" : "bg-white"}`}>EN</button>
      <button disabled={pending} onClick={() => start(() => void setLocale("de"))} className={`rounded border px-2 py-1 text-xs ${current === "de" ? "bg-slate-900 text-white" : "bg-white"}`}>DE</button>
    </div>
  );
}
