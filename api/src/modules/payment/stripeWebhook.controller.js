import { stripeClient } from "../../lib/stripe";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
export const stripeWebhookHandler = async (req, res) => {
    if (!stripeClient || !env.STRIPE_WEBHOOK_SECRET) {
        return res.status(503).json({ success: false, message: "Stripe webhook is not configured" });
    }
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
        return res.status(400).json({ success: false, message: "Missing stripe-signature" });
    }
    let event;
    try {
        const rawBody = req.body;
        if (!Buffer.isBuffer(rawBody)) {
            return res.status(400).json({ success: false, message: "Invalid raw body" });
        }
        event = stripeClient.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
    }
    catch {
        return res.status(400).json({ success: false, message: "Webhook signature verification failed" });
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId && session.payment_status === "paid") {
            await prisma.order.updateMany({
                where: { id: orderId, paymentStatus: "PENDING" },
                data: { paymentStatus: "PAID", status: "PROCESSING" },
            });
        }
    }
    res.json({ received: true });
};
//# sourceMappingURL=stripeWebhook.controller.js.map