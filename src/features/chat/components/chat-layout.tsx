"use client";

import { useState } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { ChatMessage } from "../types/message";
import { useAutoScroll } from "../hooks/use-auto-scroll";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
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
    setIsTyping(true);
  
    await new Promise((res) => setTimeout(res, 800));
  
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `This is a simulated response to: "${message}"`,
    };
  
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div  ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
      <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}