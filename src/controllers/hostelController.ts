import { Request, Response } from "express";
import axios from "axios";
import Hostel from "../models/Hostel";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper function to find a photo for a given hostel using Google's Find Place API
const findPlacePhoto = async (hostelName: string, lat: number, lng: number): Promise<string | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      hostelName
    )}&inputtype=textquery&fields=photos&locationbias=circle:2000@${lat},${lng}&key=${API_KEY}`;
    
    const response = await axios.get(url);
    const place = response.data.candidates?.[0];

    if (place && place.photos) {
      const photoReference = place.photos[0].photo_reference;
      // Construct the final, usable photo URL
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
    }
    return null; // Return null if no photo is found
  } catch (error) {
    console.error("Could not fetch place photo:", error);
    return null;
  }
};

// Main function to search for hostels based on filters
export const searchHostels = async (req: Request, res: Response) => {
  try {
    const { lat, lng, maxPrice, gender, sortBy } = req.query;

    // Start building the MongoDB query object
    const query: any = {};

    // 1. Geospatial Query (finds hostels within a 5km radius)
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: 5000, // 5 kilometers
        },
      };
    }

    // 2. Price Filter (finds hostels with price less than or equal to maxPrice)
    if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice as string, 10) };
    }

    // 3. Gender Filter
    if (gender && gender !== 'all') {
      query.gender = gender as string;
    }
    
    // Determine Sort Options
    let sortOptions: any = {};
    if (sortBy === 'price') {
      sortOptions.price = 1; // 1 for ascending (lowest price first)
    } else {
      // Default sort can be by creation date or any other field
      sortOptions.createdAt = -1; 
    }

    // Execute the query to get hostels from the database
    const hostelsFromDB = await Hostel.find(query).sort(sortOptions).lean();

    // Enrich the database results with live photo URLs from Google
    const hostelsWithPhotos = await Promise.all(
      hostelsFromDB.map(async (hostel) => {
        const photoUrl = await findPlacePhoto(
          hostel.name,
          hostel.location.coordinates[1], // latitude
          hostel.location.coordinates[0]  // longitude
        );
        return { ...hostel, photoUrl };
      })
    );

    res.json(hostelsWithPhotos);
    
  } catch (error) {
    console.error("Error searching hostels:", error);
    res.status(500).json({ message: "Error searching for hostels" });
  }
};

// Function to get details for a single hostel by its place_id
export const getHostelDetails = async (req: Request, res: Response) => {
  const { placeId } = req.params; // Note: Frontend links use _id, backend route uses placeId. Let's align this.
  const fields = 'name,place_id,geometry,vicinity,photos,rating,user_ratings_total,formatted_phone_number,website,reviews';

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching place details', error });
  }
};