import { ReactNode } from "react";

import { AppSidebar } from "./app-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden w-full bg-black text-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}