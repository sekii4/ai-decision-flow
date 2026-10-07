// localStorage persistence for the graph (browser only).

import { parseGraph } from "@/lib/graph";
import type { FlowGraph } from "@/lib/types";

const STORAGE_KEY = "ai-decision-flow:graph:v1";

// Returns the saved graph, or null when nothing valid is stored.
export function loadGraph(): FlowGraph | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseGraph(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveGraph(graph: FlowGraph): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  } catch {
    // Storage full or blocked: the editor still works, it just won't persist.
  }
}

export function clearSavedGraph(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
