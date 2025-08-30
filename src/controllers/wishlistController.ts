import { Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

export const addToWishlist = async (req: Request, res: Response) => {
  const { hostelId } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const isAlreadySaved = user.wishlist.some(item => item.toString() === hostelId);
      if (!isAlreadySaved) {
        user.wishlist.push(new mongoose.Types.ObjectId(hostelId));
        await user.save();
      }
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const { hostelId } = req.params;
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.wishlist = user.wishlist.filter(item => item.toString() !== hostelId);
      await user.save();
      res.status(200).json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const getWishlist = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};