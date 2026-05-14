import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../generated/prisma/client";

type SeedUser = {
  email: string;
  password: string;
  name: string;
  role: Role;
};

async function upsertCredentialUser({ email, password, name, role }: SeedUser) {
  const normalized = email.trim().toLowerCase();
  const hashed = await hashPassword(password);
  const existing = await prisma.user.findUnique({ where: { email: normalized } });

  if (existing) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          role,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        },
      }),
      prisma.account.updateMany({
        where: { userId: existing.id, providerId: "credential" },
        data: { password: hashed },
      }),
    ]);

    const cred = await prisma.account.findFirst({
      where: { userId: existing.id, providerId: "credential" },
    });
    if (!cred) {
      await prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: existing.id,
          providerId: "credential",
          userId: existing.id,
          password: hashed,
        },
      });
    }
    console.log(`[seed] User updated: ${normalized} (${role})`);
    return;
  }

  const userId = randomUUID();
  await prisma.$transaction([
    prisma.user.create({
      data: {
        id: userId,
        name,
        email: normalized,
        emailVerified: true,
        role,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: hashed,
      },
    }),
  ]);
  console.log(`[seed] User created: ${normalized} (${role})`);
}

async function main() {
  const adminEmail = (process.env.ADMIN_SEED_EMAIL ?? "developermdmahin@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "pass1234a";
  const adminName = process.env.ADMIN_SEED_NAME ?? "MediStore Admin";

  await upsertCredentialUser({
    email: adminEmail,
    password: adminPassword,
    name: adminName,
    role: Role.ADMIN,
  });

  await upsertCredentialUser({
    email: (process.env.DEMO_SELLER_EMAIL ?? "demo.seller@medistore.com").trim().toLowerCase(),
    password: process.env.DEMO_SELLER_PASSWORD ?? "pass1234a",
    name: process.env.DEMO_SELLER_NAME ?? "Demo Seller",
    role: Role.SELLER,
  });

  await upsertCredentialUser({
    email: (process.env.DEMO_CUSTOMER_EMAIL ?? "demo.customer@medistore.com").trim().toLowerCase(),
    password: process.env.DEMO_CUSTOMER_PASSWORD ?? "pass1234a",
    name: process.env.DEMO_CUSTOMER_NAME ?? "Demo Customer",
    role: Role.CUSTOMER,
  });
}

void main()
  .catch((err) => {
    console.error("[seed] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
