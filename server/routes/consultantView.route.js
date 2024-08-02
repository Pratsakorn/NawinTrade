import express from "express";
import { consultCustomerPortView } from "../controllers/consultantView.controller.js";

const router = express.Router();

router.post("/consultCustomerPortView", consultCustomerPortView);

export default router;
