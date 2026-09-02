import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD = "Password@123";

const users: { name: string; email: string; role: Role }[] = [
  { name: "Admin User", email: "admin@minierp.com", role: Role.ADMIN },
  { name: "Sales User", email: "sales@minierp.com", role: Role.SALES },
  { name: "Warehouse User", email: "warehouse@minierp.com", role: Role.WAREHOUSE },
  { name: "Accounts User", email: "accounts@minierp.com", role: Role.ACCOUNTS },
];

async function main() {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: hashedPassword },
    });
  }

  console.log("Seed complete. Test login credentials for each role:");
  users.forEach((u) => console.log(`  ${u.role.padEnd(10)} -> ${u.email}`));
  console.log(`  password (all roles) -> ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });