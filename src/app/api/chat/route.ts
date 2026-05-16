import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    await new Promise((res) => setTimeout(res, 1000));

    return NextResponse.json({
      reply: `
# AI Response

You said:

\`${message}\`

## Example Code

\`\`\`ts
function greet() {
  console.log("hello");
}
\`\`\`

- First item
- Second item
      `,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}