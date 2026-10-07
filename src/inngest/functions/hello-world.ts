import { inngest } from "@/inngest/client";

// Smoke-test function for Phase 1. Trigger it from the Inngest Dev Server
// UI by sending the event "test/hello". It is replaced by the workflow
// runner in Phase 3.
export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello" }] },
  async ({ event, step }) => {
    const greeting = await step.run("build-greeting", async () => {
      return `Hello, ${event.data?.name ?? "world"}!`;
    });
    return { greeting };
  },
);
