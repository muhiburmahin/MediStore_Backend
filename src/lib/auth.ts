import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {

        additionalFields: {
            role: {
                type: "string",
                defaultValue: Role.CUSTOMER,
                required: true,
                allowedValues: [Role.CUSTOMER, Role.SELLER, Role.ADMIN],
            },
            status: {
                type: "string",
                defaultValue: UserStatus.ACTIVE,
                required: true,
                allowedValues: [UserStatus.ACTIVE, UserStatus.BANNED],
            }, phone: {
                type: "string",
                required: false
            }
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    //trustedOrigins: ["http://localhost:5000"]
});
