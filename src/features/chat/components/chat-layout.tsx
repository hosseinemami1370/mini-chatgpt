"use client";

import { useState } from "react";

import { sendChatMessage } from "@/services/chat-service";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

import { ChatMessage } from "../types/message";
import { useAutoScroll } from "../hooks/use-auto-scroll";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello! How can I help you?",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useAutoScroll(messages);

  async function handleSend(message: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsTyping(true);

      const data = await sendChatMessage(message);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Something went wrong.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex h-full w-[780px] flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />

        {isTyping && <TypingIndicator />}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}