import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

// --- IMPORT YOUR ROUTERS AND MIDDLEWARE ---
import userRoutes from "./routes/userRoutes";
import hostelRoutes from "./routes/hostelRoutes";
import locationRoutes from "./routes/locationRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

const startServer = async () => {
  dotenv.config();
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- CONNECT THE API ROUTES ---
  // This tells Express how to handle requests to your API
  app.use('/api/users', userRoutes);
  app.use('/api/hostels', hostelRoutes);
  app.use('/api/locations', locationRoutes);

  // --- USE THE ERROR MIDDLEWARE (at the end) ---
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();