"use server";

export async function sendMessage(message: string) {
  return {
    reply: `Server Action says: ${message}`,
  };
}