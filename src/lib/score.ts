import { Deal, Document, Milestone, Task } from "@prisma/client";

export function readinessScore(params: {
  deal: Deal;
  tasks: Task[];
  milestones: Milestone[];
  documents: Document[];
}) {
  const { tasks, milestones, documents } = params;
  const taskDone = tasks.length ? tasks.filter((t) => t.status === "done").length / tasks.length : 1;
  const milestoneDone = milestones.length
    ? milestones.filter((m) => m.status === "done").length / milestones.length
    : 1;
  const docsDone = documents.length ? documents.filter((d) => d.uploaded).length / documents.length : 1;
  return Math.round((taskDone * 0.35 + milestoneDone * 0.35 + docsDone * 0.3) * 100);
}
