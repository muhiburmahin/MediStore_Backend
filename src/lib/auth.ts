import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import nodemailer from 'nodemailer';
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

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
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"MediStore" <your-email@gmail.com>',
          to: user.email,
          subject: "Verify Your Email Address ✔",
          text: `Please verify your email using this link: ${verificationUrl}`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background:linear-gradient(135deg,#667eea,#764ba2); font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:50px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.15);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#4f46e5,#6366f1); padding:25px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:26px;">Verify Your Email</h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
                Secure your account in one step
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px; color:#333;">
              <p style="font-size:16px;">Hello ${user.name}</p>

              <p style="font-size:16px; line-height:1.7;">
                Thank you for signing up! Please confirm your email address to
                activate your account and start using our services.
              </p>

              <div style="text-align:center; margin:35px 0;">
                <a href="${verificationUrl}"
                   style="
                     background:linear-gradient(90deg,#22c55e,#16a34a);
                     color:#ffffff;
                     padding:16px 34px;
                     text-decoration:none;
                     border-radius:30px;
                     font-size:16px;
                     font-weight:bold;
                     display:inline-block;
                     box-shadow:0 6px 15px rgba(34,197,94,0.4);
                   ">
                  Verify Email Address
                </a>
              </div>

              <p style="font-size:14px; color:#555;">
                If the button above doesn’t work, copy and paste the following link into your browser:
              </p>

              <p style="font-size:14px; word-break:break-all; background:#f1f5f9; padding:10px; border-radius:6px;">
                <a href="${verificationUrl}" style="color:#4f46e5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="font-size:14px; color:#777; margin-top:30px;">
                If you did not create an account, no further action is required.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:18px; text-align:center; font-size:12px; color:#64748b;">
              © 2026 Your App. All rights reserved.<br/>
              This is an automated message, please do not reply.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
        });
      }
      catch (err) {
        console.error(err)
        throw err;
      }

      // console.log("Message sent:", info.messageId);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  }
})
