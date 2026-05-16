import { memo } from "react";

function TypingIndicatorComponent() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-zinc-800 px-4 py-2 text-sm text-white">
        AI is typing...
      </div>
    </div>
  );
}

export const TypingIndicator = memo(
  TypingIndicatorComponent
);