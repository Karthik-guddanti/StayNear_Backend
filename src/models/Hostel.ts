import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string; address: string; phone: string;
  location: { type: 'Point'; coordinates: [number, number] };
  gender: 'male' | 'female' | 'colive'; price: number; amenities: string[];
  rating: number; reviews: number;
}
const hostelSchema = new Schema<IHostel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  gender: { type: String, required: true, enum: ['male', 'female', 'colive'] },
  price: { type: Number, required: true },
  amenities: [{ type: String }],
  rating: { type: Number, required: true, default: 4.0 },
  reviews: { type: Number, required: true, default: 20 },
}, { timestamps: true });
hostelSchema.index({ location: '2dsphere' });
export default mongoose.model<IHostel>("Hostel", hostelSchema);