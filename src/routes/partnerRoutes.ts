import express from "express";
import { handlePartnerRequest } from "../controllers/partnerController";

const router = express.Router();

// Creates the endpoint: POST /api/partners/contact
router.post("/contact", handlePartnerRequest);

export default router;