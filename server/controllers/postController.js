const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc Create post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({
      author: req.user._id,
      content,
      image: req.file ? req.file.path : ''
    });
    const populated = await Post.findById(post._id).populate('author', 'name profilePhoto role sport');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get feed posts (from people you follow + your own)
const getFeedPosts = async (req, res) => {
  try {
    const following = req.user.following;
    const posts = await Post.find({
      author: { $in: [...following, req.user._id] }
    })
      .populate('author', 'name profilePhoto role sport location')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all posts (explore)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePhoto role sport location')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Like / Unlike post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getFeedPosts, getAllPosts, likePost, deletePost };