import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
          Welcome to Mini ChatGPT
        </h1>
      </div>
    </AppShell>
  );
}