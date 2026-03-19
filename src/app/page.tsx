"use client";

import { useEffect, useRef, useState } from "react";

type Citation = {
  id: number;
  title: string;
  url: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

const quickPrompts = [
  "How do I reset my KSU password?",
  "How do I contact academic advising?",
  "Where can I find parking information?",
  "Where can I get tutoring or academic support?",
];

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(customMessage?: string) {
    const messageToSend = customMessage ?? input;

    if (!messageToSend.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: messageToSend },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  message: messageToSend,
  history: messages.slice(-6), // last 6 messages
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No answer returned.",
          citations: data.citations || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while contacting the chatbot. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <div className="mx-auto flex h-[85vh] max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h1 className="text-3xl font-bold text-zinc-900">KSU Help Chatbot</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Ask questions about common KSU services, support resources, and student help topics.
          </p>
        </div>

        <div className="border-b border-zinc-200 px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Quick questions
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-50 px-6 py-6">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
              <p className="text-sm">
                Start by asking a question about advising, password reset, parking, tutoring, or other student support topics.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-black text-white"
                        : "bg-white text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                    </p>

                    {message.role === "assistant" &&
                      message.citations &&
                      message.citations.length > 0 && (
                        <div className="mt-4 border-t border-zinc-200 pt-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Sources
                          </p>
                          <ul className="space-y-1">
                            {message.citations.map((citation) => (
                              <li key={citation.id}>
                                <a
                                  href={citation.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                >
                                  {citation.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask a KSU question..."
              className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-500 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="rounded-2xl bg-black px-5 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}