"use client";

import { useState } from "react";

type Props = {
    onSend: (message: string) => void;
    onStop?: () => void;
    isStreaming?: boolean;

};

export function ChatInput({ onSend, onStop,
    isStreaming, }: Props) {
    const [value, setValue] = useState("");

    function handleSend() {
        const trimmed = value.trim();
        if (!trimmed) return;

        onSend(trimmed);
        setValue("");
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleSend();
        }
    }

    return (
        <div className="flex gap-2">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
                placeholder="Type a message..."
            />

            

                {isStreaming ? (
                    <button
                        onClick={onStop}
                        className="rounded-lg bg-red-500 px-4 text-white"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={() => onSend(value)}
                        className="rounded-lg bg-white px-4 text-black"
                    >
                        Send
                    </button>
                )}
          
        </div>
    );
}