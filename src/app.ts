import express, { Request, Response } from "express";
import { categoryRoute } from "./modules/category/category.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { medicineRoute } from "./modules/medicine/medicien.route";
import { orderRoutes } from "./modules/order/order.route";


const app = express();
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true
}));

app.get("/", (request: Request, respons: Response) => {
    respons.send("Hello world");
});


app.use("/api/category", categoryRoute);
app.use("/api/medicine", medicineRoute);

app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", orderRoutes)


export default app;



