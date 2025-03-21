import { Router } from "express";
import { ProcessingController } from "../controllers/processing.js";
const router = Router();
const controller = new ProcessingController()

router.post("/prs/prolongation", controller.prolongation as any);

export default router;