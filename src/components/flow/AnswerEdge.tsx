"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

import type { Answer, AnswerEdge as AnswerEdgeType } from "@/lib/types";

export const ANSWER_COLORS: Record<Answer, string> = {
  YES: "#16a34a",
  NO: "#dc2626",
};

// The two edge types: a green YES edge and a red NO edge, both rendered by
// this component and told apart by `data.answer`.
export function AnswerEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps<AnswerEdgeType>) {
  const answer: Answer = data?.answer ?? "YES";
  const color = ANSWER_COLORS[answer];
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{ stroke: color, strokeWidth: selected ? 3 : 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
          style={{
            background: color,
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {answer}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
