import express from "express";
import {
  signin,
  signinStaff,
  signinConsultant,
  signout,
  signoutStaff,
  signoutConsultant,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", signin);

router.post("/signout", signout);

router.post("/signinStaff", signinStaff);

router.post("/signoutStaff", signoutStaff);

router.post("/signinConsultant", signinConsultant);

router.post("/signoutConsultant", signoutConsultant);

export default router;
