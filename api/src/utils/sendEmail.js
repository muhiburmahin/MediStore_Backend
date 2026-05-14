import nodemailer from "nodemailer";
import { env } from "../config/env";
const transporter = env.APP_USER && env.APP_PASS
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: env.APP_USER, pass: env.APP_PASS },
    })
    : null;
export async function sendEmail(to, subject, html) {
    if (!transporter) {
        console.warn("[sendEmail] SMTP not configured (APP_USER / APP_PASS). Skipping email.");
        return;
    }
    await transporter.sendMail({
        from: `"MediStore" <${env.APP_USER}>`,
        to,
        subject,
        html,
    });
}
//# sourceMappingURL=sendEmail.js.map