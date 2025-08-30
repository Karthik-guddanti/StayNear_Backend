import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  address: string;
  phone: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  gender: 'male' | 'female' | 'colive';
  price: number;
  amenities: string[];
}

const hostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // IMPORTANT: MongoDB requires [longitude, latitude] order
        required: true,
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'colive'],
    },
    price: { type: Number, required: true },
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

// This creates the special index that allows for location-based searching
hostelSchema.index({ location: '2dsphere' });

export default mongoose.model<IHostel>("Hostel", hostelSchema);