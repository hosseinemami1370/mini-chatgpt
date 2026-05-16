"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-3 leading-7">
            {children}
          </p>
        ),

        h1: ({ children }) => (
          <h1 className="mb-4 text-3xl font-bold">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-3 text-2xl font-semibold">
            {children}
          </h2>
        ),

        ul: ({ children }) => (
          <ul className="mb-3 list-disc pl-6">
            {children}
          </ul>
        ),

        code: ({ children }) => (
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-sm text-green-400">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}