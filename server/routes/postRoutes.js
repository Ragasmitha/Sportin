const express = require('express');
const router = express.Router();
const { createPost, getFeedPosts, getAllPosts, likePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sportin/posts',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });

router.get('/feed', protect, getFeedPosts);
router.get('/all', protect, getAllPosts);
router.post('/create', protect, upload.single('image'), createPost);
router.put('/like/:id', protect, likePost);
router.delete('/:id', protect, deletePost);

module.exports = router;