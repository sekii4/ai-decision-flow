"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PromptNode, PromptNodeData } from "@/lib/types";

interface NodeEditorProps {
  node: PromptNode | null;
  onChange: (id: string, patch: Partial<PromptNodeData>) => void;
  onDelete: (id: string) => void;
}

export function NodeEditor({ node, onChange, onDelete }: NodeEditorProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4 border-l bg-background p-4">
      <h2 className="text-sm font-semibold">Node editor</h2>

      {node ? (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="node-label">Name</Label>
            <Input
              id="node-label"
              value={node.data.label}
              onChange={(e) => onChange(node.id, { label: e.target.value })}
              placeholder="Short name for this step"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="node-prompt">Prompt</Label>
            <Textarea
              id="node-prompt"
              value={node.data.prompt}
              onChange={(e) => onChange(node.id, { prompt: e.target.value })}
              placeholder="A question the model can answer with YES or NO"
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              The model must answer only YES or NO. The YES and NO outputs of
              the node decide which connection is followed.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(node.id)}
          >
            Delete node
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a node to edit its name and prompt. Drag from a green YES or
          red NO dot to another node to connect them. Select a node or a
          connection and press Backspace to delete it.
        </p>
      )}
    </aside>
  );
}
