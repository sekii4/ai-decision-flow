// Shared workflow types. Used by the editor (client) and the Inngest
// runner (server), so keep this file free of server-only or browser-only code.

import type { Edge, Node } from "@xyflow/react";

export type Answer = "YES" | "NO";

export interface PromptNodeData extends Record<string, unknown> {
  label: string;
  prompt: string;
}

export interface AnswerEdgeData extends Record<string, unknown> {
  answer: Answer;
}

// A node asks the model one YES/NO question (its prompt).
export type PromptNode = Node<PromptNodeData, "prompt">;

// An edge is followed when the source node answered `data.answer`.
// The source handle id ("yes" | "no") always matches that answer.
export type AnswerEdge = Edge<AnswerEdgeData, "answer">;

export interface FlowGraph {
  nodes: PromptNode[];
  edges: AnswerEdge[];
}
