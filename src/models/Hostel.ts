import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  address: string;
  phone: string;
  location: { lat: number; lng: number };
}

const hostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHostel>("Hostel", hostelSchema);
