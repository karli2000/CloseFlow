"use client";

import { useState } from "react";

type Out = Record<string, unknown> | null;

export function DealLlmPanel({ dealId }: { dealId: string }) {
  const [out, setOut] = useState<Out>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("What is still missing for closing?");
  const [notes, setNotes] = useState("Action: confirm title commitment by Tuesday\nAction: buyer to share updated insurance binder");

  async function call(path: string, body: Record<string, unknown>) {
    setLoading(path);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, ...body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setOut(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="space-y-3 rounded-lg border bg-white p-4">
      <h2 className="text-lg font-medium">AI Copilot</h2>
      <p className="text-xs text-slate-500">
        Use these tools to draft communication, identify risks and get clear next steps. Results are shown in readable cards.
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <Btn onClick={() => call("/api/llm/summary", {})} busy={loading === "/api/llm/summary"}>Deal Summary</Btn>
        <Btn onClick={() => call("/api/llm/message-draft", { channel: "email", intent: "weekly status update" })} busy={loading === "/api/llm/message-draft"}>Draft Message</Btn>
        <Btn onClick={() => call("/api/llm/readiness", {})} busy={loading === "/api/llm/readiness"}>Readiness Explain</Btn>
        <Btn onClick={() => call("/api/llm/risk-delay", {})} busy={loading === "/api/llm/risk-delay"}>Risk/Delay</Btn>
        <Btn onClick={() => call("/api/llm/negotiation-pack", {})} busy={loading === "/api/llm/negotiation-pack"}>Negotiation Pack</Btn>
        <Btn onClick={() => call("/api/llm/auto-followup", { template: "missing_docs_ping" })} busy={loading === "/api/llm/auto-followup"}>Auto Follow-up</Btn>
        <Btn onClick={() => call("/api/llm/rescue-mode", {})} busy={loading === "/api/llm/rescue-mode"}>Rescue Mode</Btn>
      </div>

      <div className="space-y-2">
        <textarea className="w-full rounded border p-2 text-sm" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
        <div className="flex gap-2">
          <Btn onClick={() => call("/api/llm/document-index", { extras: [{ name: "Meeting notes", text: notes }] })} busy={loading === "/api/llm/document-index"}>Index Docs</Btn>
          <Btn onClick={() => call("/api/llm/document-qa", { question })} busy={loading === "/api/llm/document-qa"}>Document Q&A</Btn>
        </div>
      </div>

      <div className="space-y-2">
        <textarea className="w-full rounded border p-2 text-sm" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Btn onClick={() => call("/api/llm/meeting-notes", { notes })} busy={loading === "/api/llm/meeting-notes"}>Meeting Notes → Tasks</Btn>
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {out && <ReadableOutput out={out} />}
    </section>
  );
}

function ReadableOutput({ out }: { out: Record<string, unknown> }) {
  const summary = pickString(out, ["summary", "message", "explanation", "answer", "content", "text"]);
  const actionItems = pickStringArray(out, ["actionItems", "nextSteps", "recommendations", "tasks", "blockers", "risks"]);
  const citations = pickStringArray(out, ["citations", "sources", "references"]);

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
      {summary && (
        <div>
          <p className="mb-1 font-semibold text-slate-900">Summary</p>
          <p className="whitespace-pre-wrap text-slate-700">{summary}</p>
        </div>
      )}

      {actionItems.length > 0 && (
        <div>
          <p className="mb-1 font-semibold text-slate-900">Action items</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {actionItems.map((item, i) => (
              <li key={`${item}-${i}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {citations.length > 0 && (
        <div>
          <p className="mb-1 font-semibold text-slate-900">Sources</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {citations.map((item, i) => (
              <li key={`${item}-${i}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <details>
        <summary className="cursor-pointer text-xs text-slate-500">Show technical JSON</summary>
        <pre className="mt-2 max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(out, null, 2)}</pre>
      </details>
    </div>
  );
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  for (const v of Object.values(obj)) {
    if (typeof v === "string" && v.trim()) return v;
    if (v && typeof v === "object") {
      const nested = pickString(v as Record<string, unknown>, keys);
      if (nested) return nested;
    }
  }
  return "";
}

function pickStringArray(obj: Record<string, unknown>, keys: string[]) {
  const out: string[] = [];
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string") out.push(item);
        else if (item && typeof item === "object") {
          const txt = pickString(item as Record<string, unknown>, ["text", "title", "label", "name", "summary"]);
          if (txt) out.push(txt);
        }
      }
    }
  }
  if (out.length) return out;

  // fallback: collect useful short strings from top-level object
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.length < 180 && !["id", "status"].includes(k)) out.push(v);
  }
  return [...new Set(out)].slice(0, 8);
}

function Btn({ onClick, busy, children }: { onClick: () => void; busy?: boolean; children: React.ReactNode }) {
  return (
    <button disabled={busy} onClick={onClick} className="rounded border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60">
      {busy ? "…" : children}
    </button>
  );
}
