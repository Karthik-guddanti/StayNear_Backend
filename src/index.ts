// src/app.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import hostelRoutes from "./routes/hostelRoutes";
import locationRoutes from "./routes/locationRoutes"; 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));

// Existing route for hostels
app.use("/api/hostels", hostelRoutes);

// New route for locations
app.use("/api/locations", locationRoutes); // <-- ADD THIS LINE

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));