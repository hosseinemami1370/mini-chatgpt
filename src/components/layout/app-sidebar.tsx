export function AppSidebar() {
    return (
      <aside className="hidden w-64 border-r bg-zinc-900 md:block">
        <div className="flex h-full flex-col p-4">
          <h2 className="text-lg font-semibold text-white">
            Mini ChatGPT
          </h2>
  
          <div className="mt-6">
            <button className="w-full rounded-lg bg-white/10 px-4 py-2 text-left text-sm text-white transition hover:bg-white/20">
              + New Chat
            </button>
          </div>
        </div>
      </aside>
    );
  }