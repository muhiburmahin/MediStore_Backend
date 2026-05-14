import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
const globalForPrisma = global;
const validateDatabaseUrl = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    if (!/^postgres(ql)?:\/\//i.test(url.trim())) {
        throw new Error('DATABASE_URL must start with postgresql:// or postgres:// (PostgreSQL). Example: postgresql://USER:PASSWORD@localhost:5432/medistore');
    }
    return url;
};
export const prisma = globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === "production"
            ? ["error", "warn"]
            : ["query", "error", "warn"],
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
// Validate connection on init
validateDatabaseUrl();
//# sourceMappingURL=prisma.js.map