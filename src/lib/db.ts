import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") global.prisma = db;
