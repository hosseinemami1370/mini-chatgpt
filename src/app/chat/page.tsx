"use client";

import { useState, useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ChatLayout } from "@/features/chat/components/chat-layout";

import { Conversation } from "@/features/chat/types/conversation";
import { loadConversations, saveConversations } from "@/lib/chat-storage";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load
  useEffect(() => {
    const stored = loadConversations();

    if (stored.length > 0) {
      setConversations(stored);
      setActiveId(stored[0].id);
    } else {
      const newChat: Conversation = {
        id: crypto.randomUUID(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      };

      setConversations([newChat]);
      setActiveId(newChat.id);
    }
  }, []);

  // Persist
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  function createNewChat() {
    console.log("hi")
    const newChat: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  }

  function switchChat(id: string) {
    setActiveId(id);
  }

  function updateConversations(updater: (prev: Conversation[]) => Conversation[]) {
    setConversations(updater);
  }

  function renameConversation(id: string, title: string) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              title: title.trim() || "Untitled Chat",
            }
          : c
      )
    );
  }

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;

  return (
    <AppShell
      conversations={conversations}
      activeId={activeId}
      onSelect={switchChat}
      onNewChat={createNewChat}
      onRename={renameConversation}
    >
      <ChatLayout
        activeConversation={activeConversation}
        setConversations={setConversations}
      />
    </AppShell>
  );
}