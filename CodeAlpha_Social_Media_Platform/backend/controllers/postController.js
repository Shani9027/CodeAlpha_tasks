const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SavedPost = require('../models/SavedPost');
const { getPopulatedPost } = require('../utils/populateFields');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide post content' });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      image: image || '',
    });

    const populatedPost = await post.populate(getPopulatedPost());

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate(getPopulatedPost())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts/feed/following
// @desc    Get feed of users you're following
// @access  Private
exports.getFeedFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      user: { $in: user.following },
    })
      .populate(getPopulatedPost())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: { $in: user.following } });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(getPopulatedPost());

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    const { content, image } = req.body;
    if (content) post.content = content;
    if (image) post.image = image;

    post = await post.save();
    await post.populate(getPopulatedPost());

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if already liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already liked this post' });
    }

    post.likes.push(req.user.id);
    post = await post.save();

    // Create notification
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        user: post.user,
        type: 'like',
        referenceId: post._id,
        actor: req.user.id,
      });
    }

    await post.populate(getPopulatedPost());

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
exports.unlikePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    post = await post.save();

    await post.populate(getPopulatedPost());

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts/user/:userId
// @desc    Get posts by user
// @access  Public
exports.getPostsByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: req.params.userId })
      .populate(getPopulatedPost())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: req.params.userId });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/posts/:id/save
// @desc    Save a post
// @access  Private
exports.savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const existingSave = await SavedPost.findOne({
      user: req.user.id,
      post: req.params.id,
    });

    if (existingSave) {
      return res.status(400).json({ success: false, message: 'Post already saved' });
    }

    await SavedPost.create({
      user: req.user.id,
      post: req.params.id,
    });

    res.status(201).json({
      success: true,
      message: 'Post saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts/saved
// @desc    Get saved posts
// @access  Private
exports.getSavedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const savedPosts = await SavedPost.find({ user: req.user.id })
      .populate({
        path: 'post',
        populate: getPopulatedPost(),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SavedPost.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      posts: savedPosts.map((sp) => sp.post),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/posts/:id/unsave
// @desc    Unsave a post
// @access  Private
exports.unsavePost = async (req, res, next) => {
  try {
    await SavedPost.findOneAndDelete({
      user: req.user.id,
      post: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: 'Post unsaved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/posts/search/:query
// @desc    Search posts
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.params.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      content: { $regex: query, $options: 'i' },
    })
      .populate(getPopulatedPost())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      content: { $regex: query, $options: 'i' },
    });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};
