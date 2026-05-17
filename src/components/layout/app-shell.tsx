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
  onRename: (id: string, title: string) => void;
};

export function AppShell({
  children,
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden w-full bg-black text-white">
      <AppSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
        onNewChat={onNewChat}
        onRename= {onRename}
      />

      <main className="flex-1 overflow-y-auto w-full">{children}</main>
    </div>
  );
}
