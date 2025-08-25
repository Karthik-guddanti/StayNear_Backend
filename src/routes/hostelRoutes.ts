import express from "express";
import { getHostels, addHostel } from "../controllers/hostelController";

const router = express.Router();

router.get("/", getHostels);
router.post("/", addHostel);

export default router;
