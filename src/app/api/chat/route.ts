import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const message = body.message;

  return NextResponse.json({
    reply: `You said: ${message}`,
  });
}