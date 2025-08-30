import express from "express";
import { searchHostels } from "../controllers/hostelController";

const router = express.Router();

// This single route handles all searching and filtering
// e.g., GET /api/hostels/search?lat=...&lng=...&maxPrice=...
router.get("/search", searchHostels);

// We can add the GET by ID and POST routes later for the admin panel
// router.get("/:id", getHostelById);
// router.post("/", addHostel);

export default router;