import { openai } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      stream: true,

      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant.",
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
          const content =
            chunk.choices[0]?.delta?.content || "";

          controller.enqueue(
            encoder.encode(content)
          );
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

    return Response.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}