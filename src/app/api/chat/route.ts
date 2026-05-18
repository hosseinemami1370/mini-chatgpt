import { openai } from "@/lib/openai";

import { SYSTEM_PROMPT } from "@/ai/prompts/system-prompt";
import { personas } from "@/ai/prompts/personas";

export const runtime = "edge";
const persona = "engineer";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      stream: true,

      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${personas[persona]}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}