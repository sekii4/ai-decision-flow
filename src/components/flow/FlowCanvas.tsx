"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AnswerEdge, ANSWER_COLORS } from "@/components/flow/AnswerEdge";
import { NodeEditor } from "@/components/flow/NodeEditor";
import { PromptNode } from "@/components/flow/PromptNode";
import { Button } from "@/components/ui/button";
import {
  answerFromHandle,
  canConnect,
  createStarterGraph,
  edgeIdFor,
  validateGraph,
  type HandleId,
} from "@/lib/graph";
import { loadGraph, saveGraph } from "@/lib/storage";
import type {
  AnswerEdge as AnswerEdgeType,
  FlowGraph,
  PromptNode as PromptNodeType,
  PromptNodeData,
} from "@/lib/types";

// Defined outside the component so React Flow does not re-create them.
const nodeTypes = { prompt: PromptNode };
const edgeTypes = { answer: AnswerEdge };

// Colored arrow head for an edge. Not stored, so it is added on load.
function withArrow(edge: AnswerEdgeType): AnswerEdgeType {
  return {
    ...edge,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: ANSWER_COLORS[edge.data?.answer ?? "YES"],
    },
  };
}

function initialGraph(): FlowGraph {
  const graph = loadGraph() ?? createStarterGraph();
  return { nodes: graph.nodes, edges: graph.edges.map(withArrow) };
}

function newNodeId(): string {
  return `node-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function FlowCanvas() {
  // Read once on first render. This component only renders in the browser
  // (see FlowEditor.tsx), so localStorage is available here.
  const [initial] = useState(initialGraph);
  const [nodes, setNodes, onNodesChange] = useNodesState<PromptNodeType>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AnswerEdgeType>(initial.edges);

  // Persist the graph shortly after every change (dragging fires many).
  useEffect(() => {
    const timer = setTimeout(() => saveGraph({ nodes, edges }), 300);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  const selectedNode = nodes.find((n) => n.selected) ?? null;
  const issues = useMemo(() => validateGraph({ nodes, edges }), [nodes, edges]);

  const isValidConnection = useCallback(
    (c: Connection | Edge) => canConnect(edges, c),
    [edges],
  );

  const onConnect = useCallback(
    (c: Connection) => {
      const answer = answerFromHandle(c.sourceHandle);
      if (!answer || !canConnect(edges, c)) return;
      const edge: AnswerEdgeType = withArrow({
        id: edgeIdFor(c.source, c.sourceHandle as HandleId),
        type: "answer",
        source: c.source,
        target: c.target,
        sourceHandle: c.sourceHandle,
        data: { answer },
      });
      setEdges((current) => addEdge(edge, current));
    },
    [edges, setEdges],
  );

  const addNode = useCallback(() => {
    setNodes((current) => {
      // Place the new node below everything else so it never covers one.
      const lowest = current.reduce((max, n) => Math.max(max, n.position.y), 0);
      const node: PromptNodeType = {
        id: newNodeId(),
        type: "prompt",
        position: { x: 260, y: current.length === 0 ? 80 : lowest + 220 },
        data: { label: `Step ${current.length + 1}`, prompt: "" },
        selected: true,
      };
      return [...current.map((n) => ({ ...n, selected: false })), node];
    });
  }, [setNodes]);

  const updateNode = useCallback(
    (id: string, patch: Partial<PromptNodeData>) => {
      setNodes((current) =>
        current.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
    },
    [setNodes],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((current) => current.filter((n) => n.id !== id));
      setEdges((current) =>
        current.filter((e) => e.source !== id && e.target !== id),
      );
    },
    [setNodes, setEdges],
  );

  const resetToExample = useCallback(() => {
    const graph = createStarterGraph();
    setNodes(graph.nodes);
    setEdges(graph.edges.map(withArrow));
  }, [setNodes, setEdges]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-full w-full">
      <div className="min-w-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-left" className="flex max-w-sm flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={addNode}>
                Add node
              </Button>
              <Button size="sm" variant="outline" onClick={resetToExample}>
                Load example
              </Button>
              <Button size="sm" variant="outline" onClick={clearCanvas}>
                Clear
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {nodes.length} nodes, {edges.length} connections. Saved in this
              browser.
            </p>
            {issues.length > 0 && (
              <ul className="list-disc rounded-md border border-amber-300 bg-amber-50 py-2 pl-6 pr-3 text-xs text-amber-900">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </Panel>
        </ReactFlow>
      </div>
      <NodeEditor node={selectedNode} onChange={updateNode} onDelete={deleteNode} />
    </div>
  );
}
