import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import locationRoutes from "./routes/locationRoutes"; // import after you fix export

dotenv.config(); // this line should now work without errors

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staynear";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (_req, res) => res.send("API is running"));

// Use the routes
app.use("/api/locations", locationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
