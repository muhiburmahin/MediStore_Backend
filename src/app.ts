import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRoute } from "./modules/category/category.route";
import { medicineRoute } from "./modules/medicine/medicien.route";
import { orderRoutes } from "./modules/order/order.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";
import { AuthRoutes } from "./modules/auth/auth.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { sellerRoutes } from "./modules/seller/seller.route";
import { wishlistRoutes } from "./modules/wishlist/wishlist.route";
import { notificationRoutes } from "./modules/notification/notification.route";
import { stripeWebhookHandler } from "./modules/payment/stripeWebhook.controller";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://medistore-iota.vercel.app",
  process.env.APP_URL,
  process.env.PROD_APP_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/medistore-.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked for origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.post(
  "/api/payments/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(cookieParser());
app.use(express.json());

// Express 5 / path-to-regexp v8: bare `*` is invalid — delegate Better Auth by prefix.
const betterAuthHandler = toNodeHandler(auth);
app.use((req, res, next) => {
  const pathOnly = req.originalUrl.split("?")[0] ?? req.originalUrl;
  if (pathOnly === "/api/auth" || pathOnly.startsWith("/api/auth/")) {
    return betterAuthHandler(req, res);
  }
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "MediStore Backend is running!" });
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);

app.use("/api/categories", categoryRoute);
app.use("/api/medicines", medicineRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", userRoutes);

app.use(globalErrorHandler);

export default app;
