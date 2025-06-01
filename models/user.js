import mongoose from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { createTokenForUser } from "../services.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImg: {
      type: String,
      default: "/def.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
     encryptedGroqKey: {
      type: String,
     },
  
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPass;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return false;

    const hashedInputPass = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedInputPass !== user.password) return false;

    const token = createTokenForUser(user);
    return token;
  }
);

const USER = mongoose.model("user", userSchema);

export default USER;
