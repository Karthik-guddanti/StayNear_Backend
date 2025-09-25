import dotenv from 'dotenv';
import axios from 'axios';
import Hostel from './models/Hostel';
import connectDB from './config/db';

dotenv.config();

const sampleAmenities = [['AC', 'Laundry'], ['Laundry', 'Gym'], ['AC', 'Gym'], ['AC', 'Laundry', 'Gym']];

// ✅ NEW: Smart function to determine gender from the hostel's name
const getGenderFromName = (name: string): 'male' | 'female' | 'colive' => {
  const lowerCaseName = name.toLowerCase();
  if (/\b(women|woman|girls|ladies)\b/.test(lowerCaseName)) {
    return 'female';
  }
  if (/\b(men|man|boys)\b/.test(lowerCaseName)) {
    return 'male';
  }
  return 'colive'; // Default to co-living if no specific keywords are found
};


const importData = async () => {
  try {
    await connectDB();
    await Hostel.deleteMany();
    console.log('🗑️  Old hostel data destroyed.');

    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const lat = 17.3850;
    const lng = 78.4867;
    const radius = 5000;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lodging&keyword=hostel|pg&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const places = response.data.results;

    if (!places || places.length === 0) {
      console.log('Could not fetch any places from Google.');
      process.exit();
    }

    const hostelsToSave = places.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      googlePlaceId: place.place_id,
      phone: "9999999999",
      location: {
        type: 'Point',
        coordinates: [
          place.geometry.location.lng,
          place.geometry.location.lat,
        ],
      },
      rating: place.rating || 4.0,
      reviews: place.user_ratings_total || 0,
      photoUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : null,
      
      // ✅ FIX: Use the smart function to assign gender based on the name
      gender: getGenderFromName(place.name),
      
      amenities: sampleAmenities[Math.floor(Math.random() * sampleAmenities.length)],
    }));

    await Hostel.insertMany(hostelsToSave);

    console.log(`✅  Data Imported! ${hostelsToSave.length} hostels were added with smarter gender assignment.`);
    process.exit();
  } catch (error) {
    console.error(`❌  Error seeding data: ${error}`);
    process.exit(1);
  }
};



// ... script execution logic ...
const command = process.argv[2];
if (command === '-i') { importData(); }
// ...