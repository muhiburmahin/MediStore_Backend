import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const validateDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  if (!/^postgres(ql)?:\/\//i.test(url.trim())) {
    throw new Error(
      'DATABASE_URL must start with postgresql:// or postgres:// (PostgreSQL). Example: postgresql://USER:PASSWORD@localhost:5432/medistore'
    );
  }
  return url;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "error", "warn"],
    /** Better Auth adapter uses interactive transactions; email + sign-up can exceed 5s locally. */
    transactionOptions: {
      maxWait: 15_000,
      timeout: 25_000,
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Validate connection on init
validateDatabaseUrl();