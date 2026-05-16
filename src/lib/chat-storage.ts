import { Conversation } from "@/features/chat/types/conversation";

const STORAGE_KEY = "chat-conversations";

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversations)
  );
}

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}