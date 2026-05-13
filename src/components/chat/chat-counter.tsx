"use client";

import { useState } from "react";
import { sendMessage } from "@/app/actions/chat-actions";

export function ChatCounter() {
  const [response, setResponse] = useState("");

  async function handleClick() {
    const res = await sendMessage("Hello from Server Action");
    setResponse(res.reply);
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleClick}
        className="rounded bg-white px-4 py-2 text-black"
      >
        Call Server Action
      </button>

      <p className="mt-4 text-sm text-zinc-300">
        {response}
      </p>
    </div>
  );
}