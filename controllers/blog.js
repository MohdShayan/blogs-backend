
import BLOG from "../models/blog.js";

export const createBlogPost = async (req, res) => {
    const {title,body} = req.body;

    try {
        const blogPost = await BLOG.create({
            title,
            body,
            coverImageURL:`/uploads/${req.file.filename}`,
            createdBy: req.user._id
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
}

export const getAllBlogPosts = async (req, res) => {
    try {
        const allBlogs = await BLOG.find({}).sort({createdAt: -1});

        return res.status(200).json({
            status: "success",
            data: {
                allBlogs
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
}