"use client";

import { useState } from "react";

type Out = Record<string, unknown> | null;

export function DealLlmPanel({ dealId }: { dealId: string }) {
  const [out, setOut] = useState<Out>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [question, setQuestion] = useState("What is still missing for closing?");
  const [notes, setNotes] = useState("Action: confirm title commitment by Tuesday\nAction: buyer to share updated insurance binder");

  async function call(path: string, body: Record<string, unknown>) {
    setLoading(path);
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dealId, ...body }) });
    const json = await res.json();
    setOut(json);
    setLoading(null);
  }

  return (
    <section className="rounded-lg border bg-white p-4 space-y-3">
      <h2 className="text-lg font-medium">LLM Copilot + Intelligence + Autonomous Guardrails</h2>
      <p className="text-xs text-slate-500">Human review is default. Legal/compliance verification remains required.</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <Btn onClick={() => call('/api/llm/summary', {})} busy={loading === '/api/llm/summary'}>Deal Summary</Btn>
        <Btn onClick={() => call('/api/llm/message-draft', { channel: 'email', intent: 'weekly status update' })} busy={loading === '/api/llm/message-draft'}>Draft Message</Btn>
        <Btn onClick={() => call('/api/llm/readiness', {})} busy={loading === '/api/llm/readiness'}>Readiness Explain</Btn>
        <Btn onClick={() => call('/api/llm/risk-delay', {})} busy={loading === '/api/llm/risk-delay'}>Risk/Delay</Btn>
        <Btn onClick={() => call('/api/llm/negotiation-pack', {})} busy={loading === '/api/llm/negotiation-pack'}>Negotiation Pack</Btn>
        <Btn onClick={() => call('/api/llm/auto-followup', { template: 'missing_docs_ping' })} busy={loading === '/api/llm/auto-followup'}>Auto Follow-up</Btn>
        <Btn onClick={() => call('/api/llm/rescue-mode', {})} busy={loading === '/api/llm/rescue-mode'}>Rescue Mode</Btn>
      </div>

      <div className="space-y-2">
        <textarea className="w-full rounded border p-2 text-sm" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
        <div className="flex gap-2">
          <Btn onClick={() => call('/api/llm/document-index', { extras: [{ name: 'Meeting notes', text: notes }] })} busy={loading === '/api/llm/document-index'}>Index Docs</Btn>
          <Btn onClick={() => call('/api/llm/document-qa', { question })} busy={loading === '/api/llm/document-qa'}>Document Q&A</Btn>
        </div>
      </div>

      <div className="space-y-2">
        <textarea className="w-full rounded border p-2 text-sm" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Btn onClick={() => call('/api/llm/meeting-notes', { notes })} busy={loading === '/api/llm/meeting-notes'}>Meeting Notes → Tasks</Btn>
      </div>

      {out && <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(out, null, 2)}</pre>}
    </section>
  );
}

function Btn({ onClick, busy, children }: { onClick: () => void; busy?: boolean; children: React.ReactNode }) {
  return <button disabled={busy} onClick={onClick} className="rounded border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60">{busy ? '…' : children}</button>;
}
