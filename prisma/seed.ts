import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashSecret(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

async function ensureAdminSecret() {
  const existing = await prisma.adminSecret.findFirst();
  if (existing) {
    console.log("Admin secret already provisioned, skipping.");
    return;
  }

  const key = process.env.ADMIN_SECRET || randomBytes(9).toString("base64url");
  await prisma.adminSecret.create({ data: { keyHash: hashSecret(key) } });

  console.log(`Admin secret created -> ${key}`);
  console.log("Save this now, only the hash is stored. Use it to sign in at /admin.");
}

async function main() {
  await ensureAdminSecret();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
