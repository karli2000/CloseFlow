"use client";

import { useEffect, useMemo, useState } from "react";

type Deal = { id: string; title: string; status: string };

type AiResult = {
  summary?: string;
  explanation?: string;
  readinessScore?: number;
  riskScore?: number;
  riskAnalysis?: string;
};

export function DealAssistantWorkspace() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealId, setDealId] = useState("");
  const [newDealName, setNewDealName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [ai, setAi] = useState<AiResult | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    const res = await fetch("/api/deals");
    if (!res.ok) return;
    const data = (await res.json()) as Deal[];
    setDeals(data);
    if (!dealId && data.length) setDealId(data[0].id);
  }

  const selectedDeal = useMemo(() => deals.find((d) => d.id === dealId) || null, [deals, dealId]);

  async function createDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!newDealName.trim()) return;
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newDealName.trim(), status: "active" }),
    });
    if (!res.ok) {
      setMessage("Could not create deal.");
      return;
    }
    setNewDealName("");
    setMessage("Deal created.");
    await loadDeals();
  }

  async function uploadDocument(file: File) {
    if (!dealId) {
      setMessage("Create or select a deal first.");
      return;
    }
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("dealId", dealId);
    form.append("file", file);
    const res = await fetch("/api/documents", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) {
      setMessage(json?.error || "Upload failed");
      return;
    }
    setMessage(`Uploaded: ${file.name}`);
  }

  async function runAi(full = false) {
    if (!dealId) {
      setMessage("Create or select a deal first.");
      return;
    }
    setRunning(true);
    setMessage("");

    try {
      const calls = [
        fetch("/api/llm/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dealId }),
        }),
        fetch("/api/llm/readiness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dealId }),
        }),
      ];

      if (full) {
        calls.push(
          fetch("/api/llm/risk-delay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dealId }),
          }),
        );
      }

      const responses = await Promise.all(calls);
      const summary = await responses[0].json();
      const readiness = await responses[1].json();
      const risk = full && responses[2] ? await responses[2].json() : null;

      setAi({
        summary: summary?.summary,
        explanation: readiness?.explanation,
        readinessScore: readiness?.readinessScore,
        riskScore: risk?.riskScore,
        riskAnalysis: risk?.analysis,
      });

      if (full) setMessage("Full deal check complete.");
    } catch {
      setMessage("AI check failed. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="animate-fade-slide-up space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Simple deal workspace</h2>
        <p className="mt-1 text-sm text-slate-600">1) Create/select deal → 2) Upload documents → 3) Let AI tell you what to do next.</p>
      </div>

      <form onSubmit={createDeal} className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={newDealName}
          onChange={(e) => setNewDealName(e.target.value)}
          placeholder="New deal name (e.g. Apt 12 Closing)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">Create deal</button>
      </form>

      <div>
        <label className="mb-1 block text-sm font-medium">Selected deal</label>
        <select value={dealId} onChange={(e) => setDealId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="">-- Select deal --</option>
          {deals.map((d) => (
            <option key={d.id} value={d.id}>{d.title} ({d.status})</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <p className="mb-2 text-sm font-medium">Upload document (stored in your S3-compatible storage)</p>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadDocument(file);
          }}
          className="block w-full text-sm"
        />
        {uploading && <p className="mt-2 text-sm text-slate-500">Uploading…</p>}
      </div>

      <div className="w-full">
        <button onClick={() => runAi(true)} disabled={!dealId || running} className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60 sm:w-auto">
          {running ? "Running full check…" : "Run full deal check"}
        </button>
        <button onClick={() => runAi(false)} disabled={!dealId || running} className="mt-2 text-xs text-slate-500 underline underline-offset-2 disabled:opacity-60 sm:ml-3 sm:mt-0">
          Quick check only
        </button>
      </div>

      {message && <p className="text-sm text-slate-700">{message}</p>}

      {ai && (
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm"><span className="font-semibold">Readiness score:</span> {ai.readinessScore ?? "n/a"}/100</p>
          {typeof ai.riskScore === "number" ? (
            <p className="text-sm"><span className="font-semibold">Delay risk score:</span> {Math.round(ai.riskScore * 100)}%</p>
          ) : null}
          {ai.summary && <TextBlock title="Deal summary" text={ai.summary} />}
          {ai.explanation && <TextBlock title="What to do next" text={ai.explanation} />}
          {ai.riskAnalysis && <TextBlock title="Risk analysis" text={ai.riskAnalysis} />}
        </div>
      )}

      {selectedDeal && (
        <p className="text-xs text-slate-500">
          Need details? Open the advanced workspace at <a className="underline" href={`/deals/${selectedDeal.id}`}>/deals/{selectedDeal.id}</a>
        </p>
      )}
    </section>
  );
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-700">{text}</p>
    </div>
  );
}
