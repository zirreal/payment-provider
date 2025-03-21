import { Router } from "express";
import { ProcessingController } from "../controllers/processing.js";

const router = Router();

router.post("/api/newOrder", ProcessingController.createOrder as any);
router.post("/webhooks/paymentFailed", ProcessingController.paymentFailed as any);
router.post("/webhooks/paymentSuccessful", ProcessingController.paymentSuccessful as any);

export default router;