import { NextResponse } from "next/server";

import { env } from "@/lib/env";

// Reports whether configuration is present. Never returns secret values
// and never calls OpenAI.
export function GET() {
  return NextResponse.json({
    ok: true,
    openaiKeyConfigured: env.openaiApiKey.length > 0,
    openaiModel: env.openaiModel,
    inngestDevMode: process.env.INNGEST_DEV === "1",
  });
}
