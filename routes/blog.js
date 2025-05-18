import express from 'express';
import multer from 'multer';
import { createBlogPost, getAllBlogPosts } from '../controllers/blog';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req,res,next) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.send('Blog route');
});


router.post('/upload', upload.single('coverImage'), createBlogPost);
router.post('/blogs',  getAllBlogPosts);