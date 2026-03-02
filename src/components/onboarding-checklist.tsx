"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  id: string;
  label: string;
  href?: string;
};

const ITEMS: Item[] = [
  { id: "create-deal", label: "Create your first deal", href: "/deals" },
  { id: "add-task", label: "Open a deal and add/update tasks", href: "/deals" },
  { id: "upload-doc", label: "Add required document entries", href: "/deals" },
  { id: "run-copilot", label: "Run AI Copilot once (Summary or Risk)", href: "/deals" },
];

export function OnboardingChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("closeflow_onboarding_done") || "{}");
    } catch {
      return {};
    }
  });

  const [hidden, setHidden] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("closeflow_onboarding_hidden") === "1";
  });

  const progress = useMemo(() => {
    const completed = ITEMS.filter((i) => done[i.id]).length;
    return { completed, total: ITEMS.length };
  }, [done]);

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem("closeflow_onboarding_done", JSON.stringify(next));
  }

  function dismiss() {
    setHidden(true);
    localStorage.setItem("closeflow_onboarding_hidden", "1");
  }

  if (hidden) return null;

  return (
    <section className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Getting started checklist</h2>
        <button onClick={dismiss} className="text-xs text-slate-500 hover:text-slate-700">Hide</button>
      </div>
      <p className="mb-3 text-slate-700">Complete these steps to learn the app quickly ({progress.completed}/{progress.total}).</p>
      <ul className="space-y-2">
        {ITEMS.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded border border-indigo-100 bg-white px-3 py-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!done[item.id]} onChange={() => toggle(item.id)} />
              <span>{item.label}</span>
            </label>
            {item.href ? (
              <Link href={item.href} className="text-xs text-indigo-700 hover:underline">
                Open
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
