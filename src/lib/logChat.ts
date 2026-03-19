import { supabase } from "./supabase";

type Citation = {
  id: string | number;
  title: string;
  url: string;
};

export async function logChat(
  userMessage: string,
  assistantAnswer: string,
  citations: Citation[]
) {
  const { error } = await supabase.from("chat_logs").insert({
    user_message: userMessage,
    assistant_answer: assistantAnswer,
    citations,
  });

  if (error) {
    console.error("CHAT LOG ERROR:", error);
  }
}