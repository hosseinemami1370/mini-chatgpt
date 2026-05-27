import { memo } from "react";

import { MarkdownRenderer } from "@/components/ui/markdown/markdown-renderer";

import { ChatMessage } from "../types/message";

type Props = {
  message: ChatMessage;
  showCursor?: boolean;
};

function MessageBubbleComponent({
  message,
  showCursor = false
}: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${isUser
          ? "bg-white text-black"
          : "bg-zinc-800 text-white"
          }`}
      >
        <MarkdownRenderer content={message.content} />
        {showCursor && (
          <span className="ml-1 inline-block animate-pulse">
            ▋
          </span>
        )}
      </div>
    </div>
  );
}

export const MessageBubble = memo(
  MessageBubbleComponent
);