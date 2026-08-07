import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "alison@metacube.me";
  const password = process.env.SEED_STUDIO_PASSWORD ?? "QP47gqD4Zbv6";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "STUDIO" },
    create: {
      email,
      name: "Alison",
      role: "STUDIO",
      passwordHash,
    },
  });

  console.log(`Usuário seedado: ${user.email} (${user.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
