import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import tahunAjaranRoutes from "./routes/tahunAjaran";
import updatePresensiRoutes from "./routes/updatePresensi";
import cookieParser from "cookie-parser";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log(`connect to database = ${process.env.MONGODB_CONNECTION_STRING}`);
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tahun-ajaran", tahunAjaranRoutes);
app.use("/api/update-presensi", updatePresensiRoutes);

app.listen(7001, () => {
  console.log("server running on port: 7001");
});
