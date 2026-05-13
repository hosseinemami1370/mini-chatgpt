import { AppShell } from "@/components/layout/app-shell";
import { ChatCounter } from "@/components/chat/chat-counter";

export default function HomePage() {
  return (
    <AppShell>
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        Welcome to Mini ChatGPT
      </h1>

      <ChatCounter />
    </div>
  </AppShell>
  );
}