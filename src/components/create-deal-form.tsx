"use client";

import { useState } from "react";

type Labels = {
  title: string;
  cta: string;
  name: string;
  status: string;
  value: string;
  targetDate: string;
  success: string;
  error: string;
};

export function CreateDealForm({ labels }: { labels: Labels }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("active");
  const [value, setValue] = useState("");
  const [targetCloseAt, setTargetCloseAt] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status,
          value: value ? Number(value) : undefined,
          targetCloseAt: targetCloseAt || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setMsg(labels.success);
      setTitle("");
      setValue("");
      setTargetCloseAt("");
      window.location.reload();
    } catch {
      setMsg(labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border bg-white p-4">
      <h2 className="mb-3 text-lg font-medium">{labels.title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={labels.name} className="rounded border px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border px-3 py-2">
          <option value="lead">lead</option>
          <option value="active">active</option>
          <option value="closing">closing</option>
          <option value="closed">closed</option>
        </select>
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={labels.value} className="rounded border px-3 py-2" />
        <input type="date" value={targetCloseAt} onChange={(e) => setTargetCloseAt(e.target.value)} className="rounded border px-3 py-2" />
      </div>
      <button disabled={busy} className="mt-3 rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{labels.cta}</button>
      {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
