import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../generated/prisma/client";
import nodemailer from "nodemailer";
import { env } from "../config/env";
import { sendEmail } from "../utils/sendEmail";
const mailTransport = env.APP_USER && env.APP_PASS
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: env.APP_USER, pass: env.APP_PASS },
    })
    : null;
const trustedOrigins = [
    "http://localhost:3000",
    "https://medistore-iota.vercel.app",
    env.FRONTEND_URL,
    env.APP_URL,
    process.env.PROD_APP_URL,
].filter(Boolean);
export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        transaction: true,
    }),
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins,
    session: {
        cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    advanced: {
        cookiePrefix: "better-auth",
        useSecureCookies: env.NODE_ENV === "production",
        crossSubDomainCookies: { enabled: false },
        disableCSRFCheck: true,
    },
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
            },
            phone: {
                type: "string",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }) => {
            if (!mailTransport) {
                console.warn("[Better Auth] sendResetPassword: SMTP not configured");
                return;
            }
            await sendEmail(user.email, "Reset your MediStore password", `<p>Hi ${user.name},</p><p><a href="${url}">Click here to reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`);
        },
    },
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            socialProviders: {
                google: {
                    prompt: "select_account",
                    clientId: env.GOOGLE_CLIENT_ID,
                    clientSecret: env.GOOGLE_CLIENT_SECRET,
                },
            },
        }
        : {}),
    emailVerification: {
        sendOnSignIn: false,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            if (!mailTransport) {
                console.warn("[Better Auth] sendVerificationEmail: SMTP not configured");
                return;
            }
            await sendEmail(user.email, "Verify your MediStore email", `<p>Hi ${user.name},</p><p><a href="${url}">Verify your email address</a></p>`);
        },
    },
});
//# sourceMappingURL=auth.js.map