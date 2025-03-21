import { Router } from "express";
import { ProcessingController } from "../controllers/processing.js";
import { authenticateRequest } from "../middleware/auth.js";
const router = Router();
const controller = new ProcessingController()

router.post("/prs/prolongation", authenticateRequest as any, controller.prolongation as any);

export default router;