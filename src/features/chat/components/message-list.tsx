import { memo } from "react";

import { MessageBubble } from "./message-bubble";

import { ChatMessage } from "../types/message";

type Props = {
  messages: ChatMessage[];
};

function MessageListComponent({
  messages,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
        />
      ))}
    </div>
  );
}

export const MessageList = memo(
  MessageListComponent
);