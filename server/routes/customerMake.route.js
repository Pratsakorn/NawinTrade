import express from "express";
import {
  makeOrder,
  makePayment,
  makeDCA,
} from "../controllers/customerMake.controller.js";

const router = express.Router();

router.post("/makeOrder", makeOrder);
router.post("/makePayment", makePayment);
router.post("/makeDCA", makeDCA);

export default router;
