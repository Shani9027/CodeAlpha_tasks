const express = require('express');
const {
  getUserById,
  searchUsers,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require('../controllers/userController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/search/:query', searchUsers);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

module.exports = router;
