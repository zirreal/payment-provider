import { Router } from "express";
import { ProcessingController } from "../controllers/processing.js";
const router = Router();

router.post("/prs/prolongation", ProcessingController.prolongation as any);

export default router;