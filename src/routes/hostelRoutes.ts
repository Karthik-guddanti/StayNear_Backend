import express from "express";
import { searchHostels, getHostelById } from "../controllers/hostelController";

const router = express.Router();

// This route is for searching and filtering
router.get("/search", searchHostels);

// This route is for getting a single hostel by its database _id
router.get("/:id", getHostelById);

export default router;