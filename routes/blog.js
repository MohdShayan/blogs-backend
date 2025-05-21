import express from 'express';
import multer from 'multer';
import { createBlogPost, getAllBlogPosts, getBlogById } from '../controllers/blog.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req,file,cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.send('Blog route');
});


router.post('/upload', upload.single('coverImage'), createBlogPost);
router.get('/blogs',  getAllBlogPosts);
router.get('/blogs/:blogId', getBlogById); 
export default router;