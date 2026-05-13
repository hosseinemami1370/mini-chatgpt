import { MessageBubble } from "./message-bubble";
import { ChatMessage } from "../types/message";

type Props = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}