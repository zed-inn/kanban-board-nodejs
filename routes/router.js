import { Router } from "express";
import { CardRouter } from "./CardRouter.js";

const router = Router();

router.use("/", CardRouter);

export const AppRouter = router;
