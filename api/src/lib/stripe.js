import Stripe from "stripe";
import { env } from "../config/env";
export const stripeClient = env.STRIPE_SECRET_KEY.length > 0 ? new Stripe(env.STRIPE_SECRET_KEY) : null;
//# sourceMappingURL=stripe.js.map