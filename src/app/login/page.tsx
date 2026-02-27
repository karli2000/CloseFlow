"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const text = {
  en: { title: "CloseFlow Login", email: "Email", password: "Password", button: "Sign in", demo: "Demo users: admin/coordinator/agent/viewer @closeflow.dev, pass: demo1234" },
  de: { title: "CloseFlow Anmeldung", email: "E-Mail", password: "Passwort", button: "Anmelden", demo: "Demo-Nutzer: admin/coordinator/agent/viewer @closeflow.dev, Passwort: demo1234" },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@closeflow.dev");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<"en" | "de">("en");

  async function setLang(next: "en" | "de") {
    setLocale(next);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const t = text[locale];

  return (
    <main className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
      <div className="mb-3 flex justify-end gap-2">
        <button onClick={() => void setLang("en")} className={`rounded border px-2 py-1 text-xs ${locale === "en" ? "bg-slate-900 text-white" : "bg-white"}`}>EN</button>
        <button onClick={() => void setLang("de")} className={`rounded border px-2 py-1 text-xs ${locale === "de" ? "bg-slate-900 text-white" : "bg-white"}`}>DE</button>
      </div>
      <h1 className="mb-4 text-2xl font-semibold">{t.title}</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} />
        <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-slate-900 p-2 text-white" type="submit">{t.button}</button>
      </form>
      <p className="mt-3 text-xs text-slate-500">{t.demo}</p>
    </main>
  );
}
