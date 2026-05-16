"use client";

import { useState, useRef } from "react";

import { sleep } from "@/lib/sleep";

import { sendChatMessage } from "@/services/chat-service";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

import { ChatMessage } from "../types/message";
import { useAutoScroll } from "../hooks/use-auto-scroll";

export function ChatLayout() {
    const abortControllerRef = useRef<AbortController | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Hello! How can I help you?",
        },
    ]);

    const [isTyping, setIsTyping] = useState(false);

    const scrollRef = useAutoScroll(messages);

    async function handleSend(message: string) {
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setIsTyping(true);

            const data = await sendChatMessage(message);

            setIsTyping(false);

            const assistantMessageId = crypto.randomUUID();

            setMessages((prev) => [
                ...prev,
                {
                    id: assistantMessageId,
                    role: "assistant",
                    content: "",
                },
            ]);

            const fullText = data.reply;
            let streamedText = "";

            for (const char of fullText) {
                if (controller.signal.aborted) {
                    break;
                }

                streamedText += char;

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: streamedText }
                            : msg
                    )
                );

                await new Promise((r) => setTimeout(r, 10));
            }
        } catch {
            setIsTyping(false);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Something went wrong.",
                },
            ]);
        }
    }

    function handleStop() {
        abortControllerRef.current?.abort();
    }

    return (
        <div className="flex h-full w-[780px] flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <MessageList messages={messages} />

                {isTyping && <TypingIndicator />}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-4">
                <ChatInput
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isTyping}
                />
            </div>
        </div>
    );
}