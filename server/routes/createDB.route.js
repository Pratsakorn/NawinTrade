import express from "express";
import {
  insertHistory,
  insertStock,
  setStockPrice,
  insertYieldHistory,
} from "../controllers/createDB.controller.js";

const router = express.Router();

router.get("/insertStock", insertStock);
router.get("/insertHistory", insertHistory);
router.get("/setStockPrice", setStockPrice);
router.get("/insertYieldHistory", insertYieldHistory);
export default router;
