"use client";

import { useState } from "react";

import { sleep } from "@/lib/sleep";

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
  
      setIsTyping(false);
  
      const assistantMessageId = crypto.randomUUID();
  
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };
  
      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
  
      const fullText = data.reply;
  
      let streamedText = "";
  
      for (const char of fullText) {
        streamedText += char;
  
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: streamedText,
                }
              : msg
          )
        );
  
        await sleep(10);
      }
    } catch {
      setIsTyping(false);
  
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Something went wrong.",
      };
  
      setMessages((prev) => [...prev, errorMessage]);
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