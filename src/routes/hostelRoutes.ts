import express from 'express';
// Import both functions from the controller
import { searchNearbyHostels, getHostelById } from '../controllers/hostelController';

const router = express.Router();

// Route for searching nearby hostels
// GET /api/hostels/search?lat=...&lng=...
router.get('/search', searchNearbyHostels);

// Route for getting a single hostel by its ID
// GET /api/hostels/:hostelId
router.get('/:hostelId', getHostelById);

export default router;