import express from "express";
const app = express();
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import { connectDB } from "./ConnectDB.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkForAuthCookie } from "./middlewares/authentication.js";

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser);
app.use(checkForAuthCookie("authToken"));


app.get("/", (req, res) => {
  res.send("Hello irfnorfmfrm World");
});
app.use("/user", userRoutes);

app.listen(3003, () => {
  connectDB();
  console.log("Server started at http://localhost:3003");
});
