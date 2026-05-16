"use client";

import { useEffect, useRef, useState } from "react";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

import { ChatMessage } from "../types/message";
import { Conversation } from "../types/conversation";

import { useAutoScroll } from "../hooks/use-auto-scroll";
import { loadConversations, saveConversations } from "@/lib/chat-storage";

export function ChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const messages = activeConversation?.messages || [];

  const scrollRef = useAutoScroll(messages);

  // Load conversations on mount
  useEffect(() => {
    const stored = loadConversations();

    if (stored.length > 0) {
      setConversations(stored);
      setActiveConversationId(stored[0].id);
    } else {
      const newChat: Conversation = {
        id: crypto.randomUUID(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      };

      setConversations([newChat]);
      setActiveConversationId(newChat.id);
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  function updateActiveConversation(
    updater: (conv: Conversation) => Conversation
  ) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? updater(c) : c
      )
    );
  }

  function handleStop() {
    abortControllerRef.current?.abort();
  }

  async function handleSend(message: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    updateActiveConversation((conv) => ({
      ...conv,
      messages: [...conv.messages, userMessage],
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsTyping(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setIsTyping(false);

      const assistantMessageId = crypto.randomUUID();

      updateActiveConversation((conv) => ({
        ...conv,
        messages: [
          ...conv.messages,
          {
            id: assistantMessageId,
            role: "assistant",
            content: "",
          },
        ],
      }));

      const fullText = data.reply;
      let streamedText = "";

      for (const char of fullText) {
        if (controller.signal.aborted) break;

        streamedText += char;

        updateActiveConversation((conv) => ({
          ...conv,
          messages: conv.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedText }
              : msg
          ),
        }));

        await new Promise((r) => setTimeout(r, 10));
      }
    } catch {
      setIsTyping(false);

      updateActiveConversation((conv) => ({
        ...conv,
        messages: [
          ...conv.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong.",
          },
        ],
      }));
    }
  }

  return (
    <div className="flex  h-full w-[780px] h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />

        {isTyping && <TypingIndicator />}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isTyping}
        />
      </div>
    </div>
  );
}