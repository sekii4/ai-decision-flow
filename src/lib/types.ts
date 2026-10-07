// Shared workflow types. Used by the editor (client) and the Inngest
// runner (server), so keep this file free of server-only or browser-only code.

export type Answer = "YES" | "NO";

export interface PromptNodeData extends Record<string, unknown> {
  label: string;
  prompt: string;
}
