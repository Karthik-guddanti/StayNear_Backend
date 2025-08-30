import { Request, Response } from 'express';
import User from '../models/User';

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    // Use $addToSet to add the hostelId to the wishlist array only if it's not already present
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: hostelId } },
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.wishlist);

  } catch (error) { 
    res.status(500).json({ message: 'Server error while adding to wishlist' }); 
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    // Use $pull to remove the hostelId from the wishlist array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: hostelId } },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.wishlist);

  } catch (error) { 
    res.status(500).json({ message: 'Server error while removing from wishlist' }); 
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { 
    res.status(500).json({ message: 'Server error while getting wishlist' }); 
  }
};