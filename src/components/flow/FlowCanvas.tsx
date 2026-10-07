"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Phase 1 smoke test: two hard-coded nodes prove React Flow is installed
// and rendering. Phase 2 replaces this with the real editor.
const nodes: Node[] = [
  { id: "1", position: { x: 80, y: 80 }, data: { label: "Start node" } },
  { id: "2", position: { x: 340, y: 160 }, data: { label: "Next node" } },
];

const edges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export function FlowCanvas() {
  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
