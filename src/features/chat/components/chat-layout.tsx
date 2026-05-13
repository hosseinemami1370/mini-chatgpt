"use client";

import { useState } from "react";
import { MessageList } from "./message-list";
import { ChatMessage } from "../types/message";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you?",
    },
  ]);

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <input
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}