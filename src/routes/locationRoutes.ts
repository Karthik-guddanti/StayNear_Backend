import express from "express";
import { geocodeLocation } from "../controllers/locationController";

const router = express.Router();

// This must be GET /api/locations/search
router.get("/search", geocodeLocation);

export default router;