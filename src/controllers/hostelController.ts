import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

// ✅ This controller now fetches LIVE data from Google, not your database.

const getGenderFromName = (name: string): 'male' | 'female' | 'colive' => {
  const lowerCaseName = name.toLowerCase();
  if (/\b(women|woman|girls|ladies)\b/.test(lowerCaseName)) return 'female';
  if (/\b(men|man|boys)\b/.test(lowerCaseName)) return 'male';
  return 'colive';
};

export const searchNearbyHostels = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and longitude query parameters are required.');
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const radius = 15000; // ✅ Set to 15km as requested
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lodging&keyword=hostel|pg&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results || [];

    // Map Google's data to our Hostel shape
    const formattedHostels = results.map((place: any) => ({
      _id: place.place_id, // Use Google's place_id as the unique ID
      name: place.name,
      address: place.vicinity,
      phone: "N/A", // Nearby Search doesn't provide a phone number
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      rating: place.rating || 4.0,
      reviews: place.user_ratings_total || 0,
      photoUrl: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null,
      price: Math.floor(Math.random() * (9500 - 6500 + 1)) + 6500, // Assign a random price
      amenities: [['AC', 'Laundry'], ['Gym'], ['AC']][Math.floor(Math.random() * 3)], // Assign random amenities
      gender: getGenderFromName(place.name), // Use our smart gender detection
    }));

    res.json(formattedHostels);

  } catch (error) {
    console.error("Error fetching from Google API:", error);
    res.status(500);
    throw new Error('Failed to fetch hostel data from Google.');
  }
});


export const getHostelById = asyncHandler(async (req: Request, res: Response) => {
  // This will require a separate, more detailed implementation later
  // For now, we'll leave it as a placeholder.
  res.status(404).json({ message: 'Detail view not implemented for live API yet.' });
});