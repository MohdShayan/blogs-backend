import express from "express";
import USER from "../models/user.js";
const router = express.Router();

router.get("/user", (req, res) => {
  res.send("Hello router World");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  await USER.create({
    name,
    email,
    password,
  });

  return res.json({ success: true, message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const token = await USER.matchPasswordAndGenerateToken(email, password);

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });

  return res
    .cookie("authToken", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    })
    .json({ success: true, message: "Login successful" });
});
export default router;
