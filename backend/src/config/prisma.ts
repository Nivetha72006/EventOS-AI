import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

export default prisma;