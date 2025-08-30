import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import hostelRoutes from "./routes/hostelRoutes";
import userRoutes from "./routes/userRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import locationRoutes from "./routes/locationRoutes";

const startServer = async () => {
  // Load environment variables from .env file
  dotenv.config();

  // Connect to MongoDB and wait for it to finish before proceeding
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Simple route for checking if the API is up
  app.get("/", (_req, res) => res.send("API is running successfully"));
  
  // API Routes
  app.use("/api/hostels", hostelRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/partners", partnerRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/locations", locationRoutes);
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();