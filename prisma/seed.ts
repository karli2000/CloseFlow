import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const db = new PrismaClient();

async function main() {
  await db.automationRun.deleteMany();
  await db.event.deleteMany();
  await db.communication.deleteMany();
  await db.document.deleteMany();
  await db.task.deleteMany();
  await db.milestone.deleteMany();
  await db.party.deleteMany();
  await db.deal.deleteMany();
  await db.user.deleteMany();
  await db.organization.deleteMany();

  const org = await db.organization.create({ data: { name: "Acme Realty" } });
  const pass = await hashPassword("demo1234");

  const [admin, coordinator, agent, viewer] = await Promise.all([
    db.user.create({ data: { organizationId: org.id, name: "Admin User", email: "admin@closeflow.dev", passwordHash: pass, role: "admin" } }),
    db.user.create({ data: { organizationId: org.id, name: "Coord User", email: "coordinator@closeflow.dev", passwordHash: pass, role: "coordinator" } }),
    db.user.create({ data: { organizationId: org.id, name: "Agent User", email: "agent@closeflow.dev", passwordHash: pass, role: "agent" } }),
    db.user.create({ data: { organizationId: org.id, name: "Viewer User", email: "viewer@closeflow.dev", passwordHash: pass, role: "viewer" } }),
  ]);

  const deal = await db.deal.create({
    data: {
      organizationId: org.id,
      ownerId: agent.id,
      title: "123 Oak Street Closing",
      status: "closing",
      targetCloseAt: new Date(Date.now() + 30 * 3600 * 1000),
      value: 550000,
    },
  });

  await db.party.createMany({ data: [
    { dealId: deal.id, name: "John Buyer", type: "buyer", email: "buyer@example.com" },
    { dealId: deal.id, name: "Jane Seller", type: "seller", email: "seller@example.com" },
    { dealId: deal.id, name: "FastTitle LLC", type: "title_company", email: "title@example.com" },
  ]});

  await db.milestone.createMany({ data: [
    { dealId: deal.id, name: "Inspection complete", status: "done" },
    { dealId: deal.id, name: "Loan commitment", status: "in_progress", dueAt: new Date(Date.now() + 24 * 3600 * 1000) },
    { dealId: deal.id, name: "Final walkthrough", status: "todo", dueAt: new Date(Date.now() + 48 * 3600 * 1000) },
  ]});

  await db.task.createMany({ data: [
    { dealId: deal.id, assigneeId: coordinator.id, title: "Confirm wire instructions", status: "todo", priority: "high" },
    { dealId: deal.id, assigneeId: agent.id, title: "Schedule final walkthrough", status: "in_progress", priority: "medium" },
    { dealId: deal.id, assigneeId: admin.id, title: "Review settlement statement", status: "done", priority: "medium" },
  ]});

  await db.document.createMany({ data: [
    { dealId: deal.id, name: "Purchase Agreement", required: true, uploaded: true, uploadedAt: new Date() },
    { dealId: deal.id, name: "Title Commitment", required: true, uploaded: false },
    { dealId: deal.id, name: "Proof of Insurance", required: true, uploaded: false },
  ]});

  await db.communication.createMany({ data: [
    { dealId: deal.id, userId: agent.id, channel: "email", summary: "Sent status update to all parties" },
    { dealId: deal.id, userId: coordinator.id, channel: "phone", summary: "Called lender for update" },
  ]});

  await db.event.create({ data: { dealId: deal.id, userId: admin.id, type: "deal_created", payload: { note: "Seeded deal" } } });

  console.log("Seed complete", { orgId: org.id, users: [admin.email, coordinator.email, agent.email, viewer.email] });
}

main().finally(async () => db.$disconnect());
