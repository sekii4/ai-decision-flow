"use client";

import dynamic from "next/dynamic";

// The editor reads localStorage, so it must only render in the browser.
// Loading it with ssr: false keeps the server and client output identical.
export const FlowEditor = dynamic(
  () => import("@/components/flow/FlowCanvas").then((m) => m.FlowCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading editor...
      </div>
    ),
  },
);
