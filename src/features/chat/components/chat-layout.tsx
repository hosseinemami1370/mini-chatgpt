export function ChatLayout() {
    return (
      <div className="flex h-full flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center text-sm text-zinc-500">
            Start your conversation
          </div>
        </div>
  
        {/* Input Area */}
        <div className="border-t border-zinc-800 p-4">
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
            placeholder="Type a message..."
          />
        </div>
      </div>
    );
  }