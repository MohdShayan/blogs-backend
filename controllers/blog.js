
import BLOG from "../models/blogs.js";

export const createBlogPost = async (req, res) => {

  const { title, body } = req.body;
 
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Cover image file is required."
    });
  }

  try {
    const blogPost = await BLOG.create({
      title,
      body,
      coverImageURL: `/uploads/${req.file.filename}`,
      createdBy: req.user.id   
    });

    return res.status(201).json({
      status: "success",
      data: {
        blogPost
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};


export const getAllBlogPosts = async (req, res) => {
  try {
    const allBlogs = await BLOG.find({})
      .populate("createdBy") 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: {
        allBlogs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};


export const getBlogById = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blogPost = await BLOG.findById(blogId).populate("createdBy", "name email");

        if (!blogPost) {
            return res.status(404).json({
                status: "fail",
                message: "Blog post not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                blogPost
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
} 


export const getMyBlogs = async (req, res) => {
  try {
    const myBlogs = await BLOG.find({ createdBy: req.user.id })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: {
        myBlogs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
}