import { ReactNode } from "react";

import { AppSidebar } from "./app-sidebar";

import { Conversation } from "@/features/chat/types/conversation";

type AppShellProps = {
  children: ReactNode;
  // children: React.ReactNode;

  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
};

export function AppShell({
  children,
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden w-full bg-black text-white">
      <AppSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
        onNewChat={onNewChat}
      />

      <main className="flex-1 overflow-y-auto w-full">{children}</main>
    </div>
  );
}
