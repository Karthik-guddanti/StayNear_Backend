import { Request, Response } from "express";
import Hostel from "../models/Hostel";

// Get all hostels from DB with filtering/sorting
export const searchHostels = async (req: Request, res: Response) => {
  // This function is already correct from our previous step
  try {
    const { lat, lng, maxPrice, gender, sortBy } = req.query;
    const query: any = {};
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng as string), parseFloat(lat as string)] },
          $maxDistance: 5000,
        },
      };
    }
    if (maxPrice) { query.price = { $lte: parseInt(maxPrice as string, 10) }; }
    if (gender && gender !== 'all') { query.gender = gender as string; }
    let sortOptions: any = {};
    if (sortBy === 'price') { sortOptions.price = 1; } 
    else { sortOptions.createdAt = -1; }

    const hostels = await Hostel.find(query).sort(sortOptions).lean();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: "Error searching for hostels" });
  }
};

// Get a single hostel by its database ID
export const getHostelById = async (req: Request, res: Response) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hostel details" });
  }
};