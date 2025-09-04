// server/src/routes/hostelRoutes.ts

import express from 'express';
// ✅ THIS IMPORT REQUIRES BOTH FUNCTIONS TO EXIST IN THE CONTROLLER
import { searchNearbyHostels, getHostelById } from '../controllers/hostelController';

const router = express.Router();

// Route for searching nearby hostels
// GET /api/hostels/search?lat=...&lng=...
router.get('/search', searchNearbyHostels);

// Route for getting a single hostel by its ID
// GET /api/hostels/:hostelId
router.get('/:hostelId', getHostelById);

export default router;