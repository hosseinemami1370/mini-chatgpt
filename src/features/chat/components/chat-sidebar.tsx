import { Conversation } from "../types/conversation";

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
};

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: Props) {
  return (
    <div className="h-full w-64 border-r border-zinc-800 bg-zinc-950 p-3 flex flex-col">
      
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="mb-3 rounded-lg bg-white px-3 py-2 text-sm text-black"
      >
        + New Chat
      </button>

      {/* Chat List */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        {conversations.map((chat) => {
          const isActive = chat.id === activeId;

          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`text-left rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "hover:bg-zinc-900 text-zinc-300"
              }`}
            >
              {chat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}