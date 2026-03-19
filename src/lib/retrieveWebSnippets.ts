import { ksuWebSnippets, WebSnippet } from "./ksuWebContext";

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function retrieveRelevantWebSnippets(query: string): WebSnippet[] {
  const q = query.toLowerCase();
  const queryWords = normalize(query);

  return ksuWebSnippets
    .map((snippet) => {
      let score = 0;

      if (snippet.title.toLowerCase().includes(q)) score += 5;
      if (snippet.content.toLowerCase().includes(q)) score += 4;
      if (snippet.category.toLowerCase().includes(q)) score += 3;

      for (const keyword of snippet.keywords) {
        if (q.includes(keyword.toLowerCase())) score += 3;
      }

      const contentWords = [
        ...normalize(snippet.title),
        ...normalize(snippet.content),
        ...normalize(snippet.category),
        ...snippet.keywords.flatMap((keyword) => normalize(keyword)),
      ];

      for (const word of queryWords) {
        if (contentWords.includes(word)) score += 1;
      }

      return { ...snippet, score };
    })
    .filter((snippet) => snippet.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}