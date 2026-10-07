// Pure graph helpers: validation, connection rules and the starter graph.
// No React and no browser APIs, so the Inngest runner can reuse this file
// in Phase 3.

import { z } from "zod";

import type { Answer, AnswerEdge, FlowGraph, PromptNode } from "@/lib/types";

export type HandleId = "yes" | "no";

export function answerFromHandle(handle: string | null | undefined): Answer | null {
  if (handle === "yes") return "YES";
  if (handle === "no") return "NO";
  return null;
}

// --- Schema -----------------------------------------------------------
// Used for data coming from localStorage now, and for imported JSON and the
// Inngest event payload in later phases. Unknown fields (selection state,
// measured sizes, ...) are stripped on purpose.

const nodeSchema = z.object({
  id: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({
    label: z.string().default(""),
    prompt: z.string().default(""),
  }),
});

const edgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.enum(["yes", "no"]),
});

const graphSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

// Returns a clean graph or null when the input is not a valid graph.
export function parseGraph(input: unknown): FlowGraph | null {
  const result = graphSchema.safeParse(input);
  if (!result.success) return null;

  const nodes: PromptNode[] = result.data.nodes.map((n) => ({
    id: n.id,
    type: "prompt",
    position: n.position,
    data: n.data,
  }));
  const ids = new Set(nodes.map((n) => n.id));

  const edges: AnswerEdge[] = result.data.edges
    .filter((e) => ids.has(e.source) && ids.has(e.target))
    .map((e) => ({
      id: e.id,
      type: "answer",
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      data: { answer: e.sourceHandle === "yes" ? "YES" : "NO" },
    }));

  return { nodes, edges };
}

// --- Connection rules ---------------------------------------------------

interface ConnectionLike {
  source: string | null;
  target: string | null;
  sourceHandle?: string | null;
}

// A connection is allowed when it starts at a YES/NO handle, does not loop
// back to the same node, and the handle has no outgoing edge yet. One edge
// per handle keeps the traversal deterministic.
export function canConnect(edges: AnswerEdge[], c: ConnectionLike): boolean {
  if (!c.source || !c.target) return false;
  if (c.source === c.target) return false;
  if (!answerFromHandle(c.sourceHandle)) return false;
  return !edges.some(
    (e) => e.source === c.source && e.sourceHandle === c.sourceHandle,
  );
}

export function edgeIdFor(source: string, handle: HandleId): string {
  return `e-${source}-${handle}`;
}

// --- Validation ---------------------------------------------------------

export function findStartNodes(graph: FlowGraph): PromptNode[] {
  const hasIncoming = new Set(graph.edges.map((e) => e.target));
  return graph.nodes.filter((n) => !hasIncoming.has(n.id));
}

// Human-readable problems that would stop a workflow from running.
export function validateGraph(graph: FlowGraph): string[] {
  const issues: string[] = [];
  if (graph.nodes.length === 0) {
    issues.push("The canvas is empty. Add a node.");
    return issues;
  }

  const starts = findStartNodes(graph);
  if (starts.length === 0) {
    issues.push("No start node: every node has an incoming connection.");
  } else if (starts.length > 1) {
    const names = starts.map((n) => n.data.label || n.id).join(", ");
    issues.push(`Multiple start nodes (${names}). Connect them into one flow.`);
  }

  for (const node of graph.nodes) {
    if (!node.data.prompt.trim()) {
      issues.push(`"${node.data.label || node.id}" has an empty prompt.`);
    }
  }
  return issues;
}

// --- Starter graph --------------------------------------------------------

export function createStarterGraph(): FlowGraph {
  return {
    nodes: [
      {
        id: "start",
        type: "prompt",
        position: { x: 260, y: 40 },
        data: {
          label: "Is it a question?",
          prompt: "Is the given text phrased as a question?",
        },
      },
      {
        id: "yes-branch",
        type: "prompt",
        position: { x: 40, y: 280 },
        data: {
          label: "Is it about money?",
          prompt: "Is the given text about money or finance?",
        },
      },
      {
        id: "no-branch",
        type: "prompt",
        position: { x: 480, y: 280 },
        data: {
          label: "Is it a greeting?",
          prompt: "Is the given text a greeting?",
        },
      },
    ],
    edges: [
      {
        id: edgeIdFor("start", "yes"),
        type: "answer",
        source: "start",
        target: "yes-branch",
        sourceHandle: "yes",
        data: { answer: "YES" },
      },
      {
        id: edgeIdFor("start", "no"),
        type: "answer",
        source: "start",
        target: "no-branch",
        sourceHandle: "no",
        data: { answer: "NO" },
      },
    ],
  };
}
