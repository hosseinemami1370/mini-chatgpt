
import { useState } from "react"

import { Conversation } from "@/features/chat/types/conversation";

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, title: string) => void;
};

export function AppSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
}: Props) {

  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState("");

  return (
    <div className="h-full w-64 border-r border-zinc-800 bg-zinc-950 p-3 flex flex-col">

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="mb-3 rounded-lg bg-white px-3 py-2 text-sm text-black"
      >
        + New Chat
      </button>

      {/* Conversations */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        {conversations.map((chat) => {
          const isActive = chat.id === activeId;

          return (
            <div key={chat.id}>
              {editingId === chat.id ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => {
                    onRename(chat.id, value);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(chat.id, value);
                      setEditingId(null);
                    }
                  }}
                  className="w-full rounded bg-zinc-700 px-2 py-1 text-sm outline-none"
                />
              ) : (
                <button
                  onClick={() => onSelect(chat.id)}
                  onDoubleClick={() => {
                    setEditingId(chat.id);
                    setValue(chat.title);
                  }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${isActive
                      ? "bg-zinc-800 text-white"
                      : "hover:bg-zinc-900 text-zinc-300"
                    }`}
                >
                  {chat.title}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}