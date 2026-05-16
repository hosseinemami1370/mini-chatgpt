"use client";

import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  language: string;
  value: string;
};

export function CodeBlock({ language, value }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 text-xs text-zinc-300">
        <span>{language}</span>

        <button
          onClick={handleCopy}
          className="transition hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "#111111",
          fontSize: "14px",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}