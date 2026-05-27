import { memo } from "react";

import { MessageBubble } from "./message-bubble";

import { ChatMessage } from "../types/message";

type Props = {
  messages: ChatMessage[];
  isStreaming: boolean;
};

function MessageListComponent({
  messages,
  isStreaming
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, index) => {
        const isLastMessage =
          index === messages.length - 1;
        return (
          < MessageBubble
            key={msg.id}
            message={msg}
            showCursor={
              isStreaming &&
              msg.role == "assistant" &&
              isLastMessage
            }
          />
        )
      })}
    </div>
  );
}

export const MessageList = memo(
  MessageListComponent
);