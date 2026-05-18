"use client";

import { useRef, useState } from "react";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";

import { ChatMessage } from "../types/message";
import { Conversation } from "../types/conversation";

import { useAutoScroll } from "../hooks/use-auto-scroll";

import { generateConversationTitle } from "../utils/generate-title";

type Props = {
  activeConversation: Conversation | null;
  setConversations: React.Dispatch<
    React.SetStateAction<Conversation[]>
  >;
};

export function ChatLayout({
  activeConversation,
  setConversations,
}: Props) {
  const [isTyping, setIsTyping] = useState(false);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const messages =
    activeConversation?.messages || [];

  const scrollRef = useAutoScroll(messages);

  function updateConversation(
    updater: (conv: Conversation) => Conversation
  ) {
    if (!activeConversation) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? updater(structuredClone(c))
          : c
      )
    );
  }

  function handleStop() {
    abortControllerRef.current?.abort(
      "User stopped generation"
    );

    abortControllerRef.current = null;

    setIsTyping(false);
  }

  async function handleSend(message: string) {
    if (!activeConversation) return;

    if (isTyping) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const shouldGenerateTitle =
      activeConversation.messages.length === 0;

    updateConversation((conv) => ({
      ...conv,
      title: shouldGenerateTitle
        ? generateConversationTitle(trimmed)
        : conv.title,
      messages: [...conv.messages, userMessage],
    }));

    const assistantMessageId =
      crypto.randomUUID();

    updateConversation((conv) => ({
      ...conv,
      messages: [
        ...conv.messages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ],
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTyping(true);

    let reader: ReadableStreamDefaultReader<
      Uint8Array
    > | null = null;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamedText = "";

      while (true) {
        if (controller.signal.aborted) {
          await reader.cancel();
          break;
        }

        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk =
          decoder.decode(value);

        streamedText += chunk;

        updateConversation((conv) => ({
          ...conv,
          messages: conv.messages.map(
            (msg) =>
              msg.id ===
              assistantMessageId
                ? {
                    ...msg,
                    content: streamedText,
                  }
                : msg
          ),
        }));
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error(error);

      updateConversation((conv) => ({
        ...conv,
        messages: conv.messages.map(
          (msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    "Something went wrong.",
                }
              : msg
        ),
      }));
    } finally {
      try {
        await reader?.cancel();
      } catch {}

      reader?.releaseLock?.();

      abortControllerRef.current = null;
      setIsTyping(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />

        {isTyping && (
          <TypingIndicator />
        )}

        <div ref={scrollRef} />
      </div>

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