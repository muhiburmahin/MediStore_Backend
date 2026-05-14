import Stripe from "stripe";
import { env } from "../config/env";

export const stripeClient: Stripe | null =
  env.STRIPE_SECRET_KEY.length > 0 ? new Stripe(env.STRIPE_SECRET_KEY) : null;
