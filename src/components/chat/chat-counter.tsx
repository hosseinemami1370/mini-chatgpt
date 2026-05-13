"use client";

import { useState } from "react";

export function ChatCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm text-zinc-400">
        Client Component Counter
      </p>

      <button
        onClick={() => setCount(count + 1)}
        className="rounded-lg bg-white px-4 py-2 text-black"
      >
        Count: {count}
      </button>
    </div>
  );
}