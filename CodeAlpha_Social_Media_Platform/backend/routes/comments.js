const express = require('express');
const {
  addComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
} = require('../controllers/commentController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/:postId', protect, addComment);
router.get('/:postId', getPostComments);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);
router.post('/:id/unlike', protect, unlikeComment);

module.exports = router;
