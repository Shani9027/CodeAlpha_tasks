const User = require('../models/User');

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following', 'name email profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/search/:query
// @desc    Search users
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(10);

    res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, profileImage } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    user = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/follow/:id
// @desc    Follow a user
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    // Add to following list
    currentUser.following.push(userToFollow._id);
    // Add to followers list
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/unfollow/:id
// @desc    Unfollow a user
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/:id/followers
// @desc    Get followers list
// @access  Public
exports.getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name email profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      followers: user.followers,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/:id/following
// @desc    Get following list
// @access  Public
exports.getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name email profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      following: user.following,
    });
  } catch (error) {
    next(error);
  }
};
