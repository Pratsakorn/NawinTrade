import express from "express";
import {
  staffOrderView,
  staffPortfolio,
  staffProfile,
} from "../controllers/staffView.controller.js";

const router = express.Router();

router.post("/staffProfile", staffProfile);
router.post("/staffOrderView", staffOrderView);
router.post("/staffPortfolio", staffPortfolio)

export default router;
