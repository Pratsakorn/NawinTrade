import express from "express";
import {
  staffOrderApprove,
  staffinsertStock,
} from "../controllers/staffMake.controller.js";

const router = express.Router();

router.post("/staffinsertStock", staffinsertStock);
router.post("/staffOrderApprove", staffOrderApprove);

export default router;
