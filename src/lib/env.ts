import "server-only";

// Server-side environment access. Import this only from server code
// (route handlers, Inngest functions), never from client components.
export const env = {
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
};
