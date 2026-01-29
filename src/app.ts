import express, { Request, Response } from "express";
import { categoryRoute } from "./modules/category/category.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/", (request: Request, respons: Response) => {
    respons.send("Hello world");
});


app.use("/api/category", categoryRoute);

export default app;


