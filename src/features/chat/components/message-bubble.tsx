import { ChatMessage } from "../types/message";

type Props = {
  message: ChatMessage;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-white text-black"
            : "bg-zinc-800 text-white"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}