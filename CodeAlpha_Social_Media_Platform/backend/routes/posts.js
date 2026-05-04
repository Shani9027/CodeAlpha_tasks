const express = require('express');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getFeedFollowing,
  getPostsByUser,
  savePost,
  getSavedPosts,
  unsavePost,
  searchPosts,
} = require('../controllers/postController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/search/:query', searchPosts);
router.get('/feed/following', protect, getFeedFollowing);
router.get('/user/:userId', getPostsByUser);
router.post('/', protect, createPost);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.post('/:id/save', protect, savePost);
router.delete('/:id/unsave', protect, unsavePost);
router.get('/saved/posts', protect, getSavedPosts);
router.get('/', getAllPosts);

module.exports = router;
