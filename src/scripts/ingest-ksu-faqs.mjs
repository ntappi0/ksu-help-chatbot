import * as cheerio from "cheerio";
import slugify from "slugify";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE env vars.");
  console.error("Required:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PAGES = [
  {
    category: "Dining",
    source_title: "Campus Dining FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/dining/frequently-asked-questions.php",
  },
  {
    category: "Testing Center",
    source_title: "Testing Center FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/academics/testing-center/frequently-asked-questions/index.php",
  },
  {
    category: "Scholarships",
    source_title: "Scholarship FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/financial-aid/scholarships/faqs.php",
  },
  {
    category: "Careers",
    source_title: "Careers FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/careers/faqs.php",
  },
  {
    category: "Digital Learning Innovations",
    source_title: "Digital Learning Innovations FAQs",
    source_url:
      "https://campus.kennesaw.edu/faculty-staff/academic-affairs/curriculum-instruction-assessment/digital-learning-innovations/about/frequently-asked-questions.php",
  },
  {
    category: "CPE",
    source_title: "CPE Student Resources FAQs",
    source_url: "https://cpe.kennesaw.edu/student-resources/faqs/",
  },
];

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function makeKeywords(category, title, content) {
  const text = `${category} ${title} ${content}`.toLowerCase();
  const words = text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const stopwords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "for",
    "on",
    "in",
    "is",
    "are",
    "can",
    "do",
    "does",
    "how",
    "what",
    "when",
    "where",
    "why",
    "with",
    "my",
    "your",
    "their",
    "at",
    "by",
    "be",
    "it",
    "this",
    "that",
    "from",
    "will",
    "if",
    "i",
    "me",
    "you",
    "we",
    "our",
    "us",
  ]);

  const unique = [];
  for (const w of words) {
    if (w.length < 3 || stopwords.has(w)) continue;
    if (!unique.includes(w)) unique.push(w);
  }

  return unique.slice(0, 15);
}

/**
 * KSU FAQ pages often render question/answer content as a repeating pattern:
 * - a question-like line
 * - followed by one or more paragraphs/list items
 *
 * This parser is intentionally heuristic so it can handle several page layouts.
 */
function extractFaqPairsFromHtml(html, page) {
  const $ = cheerio.load(html);

  $("script, style, nav, header, footer, noscript").remove();

  const root = $("main").length ? $("main").first() : $("body");

  // Gather visible text blocks in order.
  const blocks = [];
  root.find("h2, h3, h4, p, li, dt, dd, strong").each((_, el) => {
    const tag = el.tagName?.toLowerCase() || "";
    const text = cleanText($(el).text());
    if (!text) return;

    blocks.push({
      tag,
      text,
    });
  });

  const results = [];
  let currentQuestion = null;
  let currentAnswerParts = [];

  function looksLikeQuestion(text) {
    if (text.length < 8 || text.length > 180) return false;
    if (text.endsWith("?")) return true;

    const starters = [
      "how do",
      "can i",
      "what is",
      "where is",
      "where can",
      "when do",
      "who do",
      "do i",
      "will my",
      "may i",
      "are there",
      "does",
      "is there",
    ];

    const lower = text.toLowerCase();
    return starters.some((s) => lower.startsWith(s));
  }

  function pushCurrent() {
    if (!currentQuestion) return;
    const content = cleanText(currentAnswerParts.join(" "));
    if (!content) return;

    const slug = slugify(`${page.category}-${currentQuestion}`, {
      lower: true,
      strict: true,
      trim: true,
    }).slice(0, 120);

    results.push({
      slug,
      category: page.category,
      title: currentQuestion,
      content,
      source_title: page.source_title,
      source_url: page.source_url,
      keywords: makeKeywords(page.category, currentQuestion, content),
    });
  }

  for (const block of blocks) {
    const text = block.text;

    if (looksLikeQuestion(text)) {
      pushCurrent();
      currentQuestion = text;
      currentAnswerParts = [];
      continue;
    }

    if (currentQuestion) {
      // Skip junk blocks that are clearly nav leftovers.
      if (
        text.length < 2 ||
        /^home$/i.test(text) ||
        /^contact us$/i.test(text) ||
        /^frequently asked questions$/i.test(text)
      ) {
        continue;
      }

      currentAnswerParts.push(text);
    }
  }

  pushCurrent();

  // Filter weak/noisy rows.
  return results.filter(
    (row) =>
      row.title &&
      row.content &&
      row.content.length >= 25 &&
      row.title.length <= 180
  );
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "KSU-Help-Chatbot-Ingest/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  return await res.text();
}

async function upsertRows(rows) {
  if (!rows.length) return;

  const { error } = await supabase
    .from("web_snippets")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    throw error;
  }
}

async function main() {
  let total = 0;

  for (const page of PAGES) {
    console.log(`\nIngesting: ${page.source_title}`);
    console.log(page.source_url);

    try {
      const html = await fetchHtml(page.source_url);
      const rows = extractFaqPairsFromHtml(html, page);

      if (!rows.length) {
        console.warn(`No FAQ rows parsed for ${page.source_title}`);
        continue;
      }

      await upsertRows(rows);
      total += rows.length;

      console.log(`Inserted/updated ${rows.length} rows.`);
      console.log("Sample titles:");
      rows.slice(0, 5).forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.title}`);
      });
    } catch (err) {
      console.error(`Failed on ${page.source_title}:`, err.message);
    }
  }

  console.log(`\nDone. Total rows inserted/updated: ${total}`);
}

main().catch((err) => {
  console.error("Fatal ingest error:", err);
  process.exit(1);
});