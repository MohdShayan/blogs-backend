import express from "express";
import multer from "multer";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogById,
} from "../controllers/blog.js";

import COMMENT from "../models/comments.js";
import BLOG from "../models/blogs.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.send("Blog route");
});

router.post("/upload", upload.single("coverImage"), createBlogPost);
router.get("/blogs", getAllBlogPosts);
router.get("/blogs/:blogId", getBlogById);


router.post("/comment/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;


  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized. Please log in.",
    });
  }

  const userId = req.user.id;

  
  if (!content) {
    return res.status(400).json({
      status: "fail",
      message: "Comment content is required.",
    });
  }

  try {
   
    const blog = await BLOG.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found.",
      });
    }

    const comment = await COMMENT.create({
      content,
      createdBy: userId,
      blogId,
    });

    await comment.populate("createdBy", "name");

    return res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.get("/comment/:blogId", async (req, res) => {
    const { blogId } = req.params;
    
    try {
        const comments = await COMMENT.find({ blogId })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });
    
        return res.status(200).json({
        status: "success",
        data: {
            comments,
        },
        });
    } catch (error) {
        return res.status(500).json({
        status: "fail",
        message: error.message,
        });
    }
});


export default router;
