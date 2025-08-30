import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';
import type { IHostel } from './Hostel';

// Define the properties of a User document
export interface IUser extends Document {
  name: string;
  email: string;

  password: string;
  wishlist: mongoose.Types.ObjectId[] | IHostel[]; // Array of references to Hostels
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel'
    }]
  },
  { timestamps: true }
);

// This function runs BEFORE a user is saved to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Add a method to the user model to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;