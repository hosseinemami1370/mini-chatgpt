import { ChatMessage } from "@/features/chat/types/message";

const STORAGE_KEY = "chat-messages";

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(messages)
  );
}

export function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}