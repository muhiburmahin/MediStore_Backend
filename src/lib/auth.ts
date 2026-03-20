import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: { enabled: false },
    disableCSRFCheck: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://medistore-iota.vercel.app"
  ],

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
        required: false
      }
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailVerification: {
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        await transporter.sendMail({
          from: '"MediStore" <your-email@gmail.com>',
          to: user.email,
          subject: "Verify Your Email Address ✔",
          text: `Please verify your email using this link: ${verificationUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
               <h2>Hello ${user.name}</h2>
               <p>Please click the button below to verify your email:</p>
               <a href="${verificationUrl}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
            </div>
          `,
        });
      } catch (err) {
        console.error("Email sending failed:", err);
        throw err;
      }
    },
  },
});