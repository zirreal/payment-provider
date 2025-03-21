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

router.get("/order-status", (req, res) => {
    res.render("order-status");
});
  

router.get("/redirect_urls", (req, res) => {
    res.render("redirect-urls");
});
  
router.get("/:type(success|cancel|failure)", (req, res) => {
    res.render("order-status");
});

export default router;
