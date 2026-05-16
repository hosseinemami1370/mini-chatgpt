import { CodeBlock } from "./code-block";

export const markdownComponents = {
  p: ({ children }: any) => (
    <p className="mb-3 leading-7">
      {children}
    </p>
  ),

  h1: ({ children }: any) => (
    <h1 className="mb-4 text-3xl font-bold">
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2 className="mb-3 text-2xl font-semibold">
      {children}
    </h2>
  ),

  h3: ({ children }: any) => (
    <h3 className="mb-2 text-xl font-semibold">
      {children}
    </h3>
  ),

  ul: ({ children }: any) => (
    <ul className="mb-3 list-disc pl-6">
      {children}
    </ul>
  ),

  ol: ({ children }: any) => (
    <ol className="mb-3 list-decimal pl-6">
      {children}
    </ol>
  ),

  li: ({ children }: any) => (
    <li className="mb-1">
      {children}
    </li>
  ),

  blockquote: ({ children }: any) => (
    <blockquote className="my-4 border-l-4 border-zinc-700 pl-4 italic text-zinc-300">
      {children}
    </blockquote>
  ),

  code(props: any) {
    const { children, className } = props;

    const match = /language-(\w+)/.exec(
      className || ""
    );

    const language = match?.[1];

    const value = String(children).replace(/\n$/, "");

    if (language) {
      return (
        <CodeBlock
          language={language}
          value={value}
        />
      );
    }

    return (
      <code className="rounded bg-zinc-900 px-1 py-0.5 text-sm text-green-400">
        {children}
      </code>
    );
  },
};