import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};


export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExists: IUser | null = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists.');
  }
  const user: IUser = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  }
});


export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: IUser | null = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});