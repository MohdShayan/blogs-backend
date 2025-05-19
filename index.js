import express from "express";
const app = express();
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import { connectDB } from "./ConnectDB.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkForAuthCookie } from "./middlewares/authentication.js";
import blogRoutes from "./routes/blog.js";

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


app.use("/user", userRoutes);
app.use("/api",blogRoutes);
app.get("/", (req, res) => {
  res.send("Hello irfnorfmfrm World");
});

app.listen(3000, () => {
  connectDB();
  console.log("Server started at http://localhost:3000");
});
