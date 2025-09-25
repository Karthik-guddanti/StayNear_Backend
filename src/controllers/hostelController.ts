import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

const getGenderFromName = (name: string): 'male' | 'female' | 'colive' => {
  const lowerCaseName = name.toLowerCase();
  if (/\b(women|woman|girls|ladies)\b/.test(lowerCaseName)) return 'female';
  if (/\b(men|man|boys)\b/.test(lowerCaseName)) return 'male';
  return 'colive';
};

const sampleRoomTypes = [['Private', '4-Bed Dorm'], ['4-Bed Dorm', '6-Bed Dorm'], ['Private', '6-Bed Dorm'], ['4-Bed Dorm']];
const sampleAmenities = [['AC', 'Laundry'], ['Laundry', 'Gym'], ['AC', 'Gym'], ['AC', 'Laundry', 'Gym']];

export const searchNearbyHostels = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and longitude query parameters are required.');
  }
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const radius = 5000;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lodging&keyword=hostel|pg&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results || [];
    const formattedHostels = results.map((place: any) => ({
      _id: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: { type: 'Point', coordinates: [place.geometry.location.lng, place.geometry.location.lat] },
      rating: place.rating || 4.0,
      reviews: place.user_ratings_total || 0,
      photoUrl: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null,
      amenities: sampleAmenities[Math.floor(Math.random() * sampleAmenities.length)],
      gender: getGenderFromName(place.name),
      roomTypes: sampleRoomTypes[Math.floor(Math.random() * sampleRoomTypes.length)],
    }));
    res.json(formattedHostels);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch hostel data from Google.');
  }
});


export const getHostelById = asyncHandler(async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!hostelId) { 
    res.status(400);
    throw new Error('Hostel ID (Place ID) is required.');
  }

  const fields = 'name,formatted_address,formatted_phone_number,photo,rating,user_ratings_total,geometry,website';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hostelId}&fields=${fields}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const place = response.data.result;
    if (!place) {
      res.status(404);
      throw new Error('Hostel not found with the given ID.');
    }
    const formattedHostel = {
      _id: hostelId,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || "N/A",
      website: place.website || "N/A", // ✅ NEW: Add website to the response
      location: { type: 'Point', coordinates: [place.geometry.location.lng, place.geometry.location.lat] },
      rating: place.rating || 4.0,
      reviews: place.user_ratings_total || 0,
      photoUrl: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null,
      amenities: sampleAmenities[Math.floor(Math.random() * sampleAmenities.length)],
      gender: getGenderFromName(place.name),
      roomTypes: sampleRoomTypes[Math.floor(Math.random() * sampleRoomTypes.length)],
    };
    res.json(formattedHostel);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch hostel details.');
  }
});