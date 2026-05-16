"use client";

import { useRef, useState } from "react";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

import { ChatMessage } from "../types/message";
import { Conversation } from "../types/conversation";

import { useAutoScroll } from "../hooks/use-auto-scroll";

type Props = {
  activeConversation: Conversation | null;
  setConversations: React.Dispatch<
    React.SetStateAction<Conversation[]>
  >;
};

export function ChatLayout({
  activeConversation,
  setConversations,
}: Props) {
  const [isTyping, setIsTyping] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const messages = activeConversation?.messages || [];

  const scrollRef = useAutoScroll(messages);

  // -----------------------------
  // Update helper (IMPORTANT FIX)
  // -----------------------------
  function updateConversation(
    updater: (conv: Conversation) => Conversation
  ) {
    if (!activeConversation) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? updater(structuredClone(c))
          : c
      )
    );
  }

  // -----------------------------
  // STOP STREAMING
  // -----------------------------
  function handleStop() {
    abortControllerRef.current?.abort();
  }

  // -----------------------------
  // SEND MESSAGE + STREAM
  // -----------------------------
  async function handleSend(message: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    updateConversation((conv) => ({
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

      updateConversation((conv) => ({
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

        updateConversation((conv) => ({
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

      updateConversation((conv) => ({
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
    <div className="flex flex-1 flex-col">
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