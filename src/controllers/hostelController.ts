import { Request, Response } from "express";
import Hostel from "../models/Hostel";

export const getHostels = async (req: Request, res: Response) => {
  const hostels = await Hostel.find();
  res.json(hostels);
};

export const addHostel = async (req: Request, res: Response) => {
  const hostel = new Hostel(req.body);
  const saved = await hostel.save();
  res.json(saved);
};
