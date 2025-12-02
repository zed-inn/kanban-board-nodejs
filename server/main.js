import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { AppRouter } from "../routes/router.js";
import "../utils/response.js";

const app = express();

// middlewares
app.use(express.json({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(helmet());

// frontend and static files
app.use(express.static("./public"));

app.use("/", AppRouter); // main router for application

export default app;
