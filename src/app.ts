import express, { Request, Response } from "express";
import { categoryRoute } from "./modules/category/category.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { medicineRoute } from "./modules/medicine/medicien.route";
import { orderRoutes } from "./modules/order/order.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";

const app = express();


// app.use(cors({
//     origin: process.env.APP_URL || "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
// }));

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:3000", // Frontend
            "http://localhost:5000", // Backend (self)
            process.env.APP_URL,      // Production Frontend
            process.env.BETTER_AUTH_URL // Better Auth base URL
        ].filter(Boolean) as string[];

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked for origin: ${origin}`);
            callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/", (request: Request, respons: Response) => {
    respons.send("Hello world");
});


app.use("/api/categories", categoryRoute);

app.use("/api/medicines", medicineRoute);
app.use("/api/seller/medicines", medicineRoute);

app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", orderRoutes)
app.use("/api/review", reviewRoutes);
app.use("/api", userRoutes);


export default app;




