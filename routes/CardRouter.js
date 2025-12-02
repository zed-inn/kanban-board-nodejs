import { Router } from "express";
import { CardController } from "../controllers/CardController.js";

const router = Router();

router.get("/initial", CardController.readInitial);

router.get("/to-do", CardController.readToDo);

router.get("/in-progress", CardController.readInProgress);

router.get("/done", CardController.readDone);

export const CardRouter = router;
