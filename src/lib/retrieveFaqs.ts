import { supabase } from "./supabase";

type Faq = {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  source_title: string;
  source_url: string;
};

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function score(query: string, faq: Faq): number {
  const q = query.toLowerCase();

  let score = 0;

  if (faq.question.toLowerCase().includes(q)) score += 5;
  if (faq.answer.toLowerCase().includes(q)) score += 3;
  if (faq.category.toLowerCase().includes(q)) score += 2;

  for (const tag of faq.tags || []) {
    if (q.includes(tag.toLowerCase())) score += 2;
  }

  return score;
}

export async function retrieveRelevantFaqs(query: string): Promise<Faq[]> {
  const { data, error } = await supabase.from("faqs").select("*");

  if (error) throw error;

  return (data as Faq[])
    .map((faq) => ({
      ...faq,
      score: score(query, faq),
    }))
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}