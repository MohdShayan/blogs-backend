import express from "express";
import USER from "../models/user.js";
const router = express.Router();
import CryptoJS from "crypto-js";

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
      httpOnly: true,      // Prevents client-side access
      sameSite: "None",    // Allows cross-site usage
      secure: true         
    })
    .json({ success: true, message: "Login successful",user: req.user });
});

router.get("/logout", async (req, res)  => {
  res
    .clearCookie("authToken")
    .json({ success: true, message: "Logout successful" });
});

router.get("/me", async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const dbUser = await USER.findById(user.id);
    return res.json({ success: true, user: dbUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


router.post('/api/save-key',  async (req, res) => {
  const { groqApiKey } = req.body;
  const encryptedKey = CryptoJS.AES.encrypt(groqApiKey, process.env.SECRET_KEY).toString();

  await USER.findByIdAndUpdate(req.user.id, { encryptedGroqKey: encryptedKey });
  res.json({ success: true, message: "API key saved securely." });
});

export default router;
