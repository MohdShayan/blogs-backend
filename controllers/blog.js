import BLOG from "../models/blogs.js";
import CryptoJS from "crypto-js";
import USER from "../models/user.js";
import { Groq } from "groq-sdk";

export const createBlogPost = async (req, res) => {
  const { title, body } = req.body;

  let imageUrl;

  if (req.file) {
    imageUrl = req.file.path;
  } else {
    imageUrl =
      "https://res.cloudinary.com/dhcigrzzz/image/upload/v1748772424/aetcloud_g5yd88.png";
  }

  try {
    const blogPost = await BLOG.create({
      title,
      body,
      coverImageURL: imageUrl,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      status: "success",
      data: {
        blogPost,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getAllBlogPosts = async (req, res) => {
  try {
    const allBlogs = await BLOG.find({status: "published"})
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
    const blogPost = await BLOG.findById(blogId).populate(
      "createdBy",
      "name email"
    );

    if (!blogPost) {
      return res.status(404).json({
        status: "fail",
        message: "Blog post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        blogPost,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const myBlogs = await BLOG.find({ createdBy: req.user.id, status: "published" })
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
};

export async function HandleScheduleBlog(req, res) {
  try {
    const { title, publishAt } = req.body;
    const userId = req.user.id;

    const user = await USER.findById(userId);
    if (!user || !user.encryptedGroqKey) {
      return res
        .status(400)
        .json({ success: false, message: "API key missing" });
    }

    const decryptedKey = CryptoJS.AES.decrypt(
      user.encryptedGroqKey,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    // Create Groq client with user's key
    const groq = new Groq({
      apiKey: decryptedKey,
    });

    let generatedText = "";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert blog writer and content strategist. You write well-structured, original, and engaging blog posts that are optimized for SEO and user readability. Always use a friendly yet professional tone. Keep content clear, concise, and informative, suitable for a general audience with little to no technical background unless specified. Follow modern blogging best practices, including using catchy titles, subheadings, examples, and smooth transitions. Do not include repetitive phrases or overly generic filler.
`, // System prompt
        },
        {
          role: "user",
          content: `
            Write a well-researched, informative, and engaging blog post of around 600 words on the title: "${title}". 

            Use the following structure:
            - Title: Create a catchy, SEO-friendly title.
            - Introduction: Hook the reader with a relatable or thought-provoking opening. Briefly explain the importance of the title.
            - Body: Divide the content into 2–3 sections using subheadings. In each section:
              - Explain key ideas clearly.
              - Use examples, facts, or data if relevant.
              - Keep paragraphs short and readable.
            - Conclusion: Summarize the key points. Optionally, add a call to action or closing thought.

            Writing style:
            - Use a conversational, friendly tone but maintain professionalism.
            - Avoid jargon unless necessary, and explain it if used.
            - Make it easy to understand for beginners or general readers.

            Additional guidelines:
            - Avoid plagiarism — write original content.
            - Do not exceed 600 words.
            - Use bullet points or lists if it helps readability.
            - Include transitional phrases to keep the flow smooth.
            - Make sure the blog is grammatically correct and SEO-optimized.
            `, 
        },
      ],
      model: "gemma2-9b-it",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    // Collect streamed content
    for await (const chunk of chatCompletion) {
      generatedText += chunk.choices[0]?.delta?.content || "";
    }

    
    const newBlog = await BLOG.create({
      title,
      body: generatedText,
      createdBy: userId,
      status: "scheduled",
      publishAt: moment.tz(publishAt, "Asia/Kolkata").toDate(),
    });

    return res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Schedule Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllScheduledBlogs = async (req, res) => {
  try {
    const scheduledBlogs = await BLOG.find({ status: "scheduled" })
      .populate("createdBy")
      .sort({ publishAt: 1 });

    return res.status(200).json({
      status: "success",
      data: {
        scheduledBlogs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};