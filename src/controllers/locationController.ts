import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

export const searchLocation = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Search query is required.');
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    query as string
  )}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch location data from Google.');
  }
});