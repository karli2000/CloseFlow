import { db } from "@/lib/db";

function tokenize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

export function chunkText(content: string, size = 120) {
  const words = content.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(" "));
  return out;
}

function keywordList(content: string, max = 18) {
  const freq = new Map<string, number>();
  for (const token of tokenize(content)) {
    if (token.length < 3) continue;
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([k]) => k);
}

export async function indexDealDocuments(dealId: string) {
  const docs = await db.document.findMany({ where: { dealId } });
  await db.docChunk.deleteMany({ where: { dealId } });

  let total = 0;
  for (const doc of docs) {
    const base = [doc.name, doc.textContent || "", JSON.stringify(doc.metadata || {})].join("\n").trim();
    if (!base) continue;
    const chunks = chunkText(base, 120);
    for (let idx = 0; idx < chunks.length; idx++) {
      const content = chunks[idx];
      await db.docChunk.create({
        data: {
          dealId,
          documentId: doc.id,
          sourceName: doc.name,
          chunkIndex: idx,
          content,
          keywords: keywordList(content),
          embedding: { surrogate: keywordList(content, 10) },
          meta: { uploaded: doc.uploaded, required: doc.required },
        },
      });
      total += 1;
    }
  }

  return { documents: docs.length, chunks: total };
}

export async function searchChunks(dealId: string, query: string, limit = 5) {
  const terms = tokenize(query);
  const chunks = await db.docChunk.findMany({ where: { dealId }, take: 200, orderBy: { createdAt: "desc" } });

  const scored = chunks.map((chunk) => {
    const hay = `${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase();
    const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0) + (chunk.keywords.some((k) => terms.includes(k)) ? 0.25 : 0);
    return { chunk, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);

  return scored.map((x) => ({
    id: x.chunk.id,
    source: x.chunk.sourceName,
    snippet: x.chunk.content.slice(0, 260),
    score: Number(x.score.toFixed(2)),
  }));
}
