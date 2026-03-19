import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { retrieveRelevantFaqs } from "@/lib/retrieveFaqs";
import { retrieveRelevantWebSnippets } from "@/lib/retrieveWebSnippets";
import { logChat } from "@/lib/logChat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;
    const history = body.history || [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message." },
        { status: 400 }
      );
    }

    // 🔍 Retrieve data from both sources
    const faqResults = await retrieveRelevantFaqs(message);
    const webResults = retrieveRelevantWebSnippets(message);

    // 🧠 Build FAQ context
    const faqContext = faqResults
      .map(
        (f, i) => `
[DATABASE FAQ ${i + 1}]
Category: ${f.category}
Question: ${f.question}
Answer: ${f.answer}
Source: ${f.source_title}
URL: ${f.source_url}
`
      )
      .join("\n");

    // 🌐 Build webpage context
    const webContext = webResults
      .map(
        (w, i) => `
[WEB SOURCE ${i + 1}]
Category: ${w.category}
Title: ${w.title}
Content: ${w.content}
Source: ${w.source_title}
URL: ${w.source_url}
`
      )
      .join("\n");

    // 💬 Convert history
    const historyMessages = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const hasAnyContext =
      faqResults.length > 0 || webResults.length > 0;

    if (!hasAnyContext) {
      return NextResponse.json({
        answer:
          "I could not find a strong match in the current KSU knowledge base. Try asking in a more specific way, such as dining, testing, scholarships, careers, or D2L support.",
        citations: [],
      });
    }

    // 🤖 Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are a helpful, conversational assistant for Kennesaw State University (KSU).

Rules:
- Speak naturally and conversationally (like ChatGPT)
- Do NOT sound robotic
- Use provided KSU context as supporting evidence
- Prefer official webpage context over database FAQs
- Combine information when helpful
- Use conversation history for follow-up questions
- If unsure, say so clearly
- If needed, ask one short follow-up question
- Never invent policies, deadlines, or official details
`,
        },

        ...historyMessages,

        {
          role: "user",
          content: `
DATABASE FAQ CONTEXT:
${faqContext || "None"}

OFFICIAL KSU WEBPAGE CONTEXT:
${webContext || "None"}

USER QUESTION:
${message}

Answer conversationally:
`,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn’t generate a response.";

    // 📚 Combine citations
    const citations = [
      ...faqResults.map((f) => ({
        id: `faq-${f.id}`,
        title: f.source_title,
        url: f.source_url,
      })),
      ...webResults.map((w) => ({
        id: `web-${w.id}`,
        title: w.source_title,
        url: w.source_url,
      })),
    ];

    // 🔁 Remove duplicates
    const uniqueCitations = citations.filter(
      (citation, index, self) =>
        index === self.findIndex((c) => c.url === citation.url)
    );

    // 📝 Log the conversation
    await logChat(message, answer, uniqueCitations);

    return NextResponse.json({
      answer,
      citations: uniqueCitations,
    });
  } catch (error) {
    console.error("API CHAT ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while generating the response. Please try again.",
      },
      { status: 500 }
    );
  }
}