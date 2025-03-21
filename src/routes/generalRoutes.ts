import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("index");
});
  
router.get("/config", (req, res) => {
    res.send({
        revolutPublicKey: process.env.REVOLUT_API_PUBLIC_KEY,
    });
});
  
router.get("/:type(success|cancel|failure)", (req, res) => {
    res.render("order-status");
});

export default router;
