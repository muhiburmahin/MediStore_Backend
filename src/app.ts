import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRoute } from "./modules/category/category.route";
import { medicineRoute } from "./modules/medicine/medicien.route";
import { orderRoutes } from "./modules/order/order.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";

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

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "MediStore Backend is running!" });
});

app.use("/api/categories", categoryRoute);
app.use("/api/medicines", medicineRoute);
app.use("/api/seller/medicines", medicineRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", userRoutes);

export default app;

