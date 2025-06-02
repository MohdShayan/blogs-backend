import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      default: "https://res.cloudinary.com/dhcigrzzz/image/upload/v1748772424/aetcloud_g5yd88.png",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
    type: String,
    enum: ["draft", "scheduled", "published"],
    default: "published",
    },
    publishAt: {
    type: Date,
    default:Date.now,
},
  },
  { timestamps: true }
);

const BLOG = mongoose.model("blog", blogSchema);
export default BLOG;
