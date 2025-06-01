import express from "express";
const app = express();
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import { connectDB } from "./ConnectDB.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import BlogScheduler from './controllers/publish-blog.js';

import { checkForAuthCookie } from "./middlewares/authentication.js";
import blogRoutes from "./routes/blog.js";
import e from "express";

const PORT = process.env.PORT || 3000;

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("authToken"));
app.use("/uploads", express.static("uploads"));


app.use("/user", userRoutes);
app.use("/api",blogRoutes);

app.get("/", (req, res) => {
  res.send("Hello World Server is running");
});

app.listen(PORT, () => {
  connectDB();
  BlogScheduler();
  console.log("Server started at http://localhost:" + PORT);
});

export default app;