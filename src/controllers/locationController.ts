import { Request, Response } from 'express';
import axios from 'axios';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const geocodeLocation = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&key=${API_KEY}`;
    
    const response = await axios.get(url);
    
    // Check if Google returned a successful status
    if (response.data.status === 'OK') {
      res.json(response.data);
    } else {
      res.status(404).json({ message: 'Location not found by Google API', details: response.data.status });
    }
  } catch (error) {
    console.error("Geocoding API error:", error);
    res.status(500).json({ message: 'Error fetching data from Geocoding API' });
  }
};