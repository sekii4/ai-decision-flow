"use client";

import { Handle, Position, useNodeConnections, type NodeProps } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PromptNode as PromptNodeType } from "@/lib/types";

export function PromptNode({ data, selected }: NodeProps<PromptNodeType>) {
  // A node with no incoming connection is where the workflow starts.
  const incoming = useNodeConnections({ handleType: "target" });
  const isStart = incoming.length === 0;

  return (
    <div
      className={cn(
        "w-60 rounded-lg border bg-card text-card-foreground shadow-sm",
        selected && "ring-2 ring-primary",
      )}
    >
      <Handle type="target" position={Position.Top} style={{ width: 12, height: 12 }} />

      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="truncate text-sm font-medium">
          {data.label || "Untitled node"}
        </span>
        {isStart && <Badge variant="secondary">Start</Badge>}
      </div>

      <p className="line-clamp-3 min-h-12 px-3 py-2 text-xs text-muted-foreground">
        {data.prompt || "No prompt yet. Select the node to edit it."}
      </p>

      <div className="grid grid-cols-2 pb-2 pt-1 text-center text-[10px] font-bold">
        <span className="text-green-600">YES</span>
        <span className="text-red-600">NO</span>
      </div>

      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        style={{ left: "25%", width: 12, height: 12, background: "#16a34a" }}
      />
      <Handle
        id="no"
        type="source"
        position={Position.Bottom}
        style={{ left: "75%", width: 12, height: 12, background: "#dc2626" }}
      />
    </div>
  );
}
