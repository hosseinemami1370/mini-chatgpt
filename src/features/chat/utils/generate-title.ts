export function generateConversationTitle(
    message: string
  ) {
    return message
      .trim()
      .slice(0, 10)
      .replace(/\n/g, " ");
  }