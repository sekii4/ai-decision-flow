import { FlowCanvas } from "@/components/flow/FlowCanvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">AI Decision Flow</h1>
          <Badge variant="secondary">Phase 1: setup</Badge>
        </div>
        <Button variant="outline" size="sm" disabled>
          Run workflow
        </Button>
      </header>
      <main className="min-h-0 flex-1">
        <FlowCanvas />
      </main>
    </div>
  );
}
