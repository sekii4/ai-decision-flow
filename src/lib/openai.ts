import "server-only";
import OpenAI from "openai";

import { env } from "@/lib/env";

let client: OpenAI | null = null;

// Lazy singleton: the app still boots without a key, and the error
// only appears when a workflow node actually calls the model.
export function getOpenAI(): OpenAI {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env.local.");
  }
  client ??= new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}
