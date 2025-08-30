import { Request, Response } from "express";
import User, { IUser } from "../models/User"; // Make sure IUser is exported from your model
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    // 👇 Explicitly type the user object
    const user: IUser = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // 👇 Explicitly type the user object
    const user: IUser | null = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};