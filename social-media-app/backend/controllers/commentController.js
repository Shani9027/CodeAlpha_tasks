const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// @route   POST /api/comments/:postId
// @desc    Add comment to post
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text, parentCommentId } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide comment text' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user.id,
      text,
      parentComment: parentCommentId || null,
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // Create notification
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        user: post.user,
        type: 'comment',
        referenceId: post._id,
        actor: req.user.id,
      });
    }

    const populatedComment = await comment.populate({
      path: 'user',
      select: '-password',
    });

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/comments/:id/like
// @desc    Like a comment
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already liked this comment' });
    }

    comment.likes.push(req.user.id);
    comment = await comment.save();

    await comment.populate({
      path: 'user',
      select: '-password',
    });

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/comments/:id/unlike
// @desc    Unlike a comment
// @access  Private
exports.unlikeComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
    comment = await comment.save();

    await comment.populate({
      path: 'user',
      select: '-password',
    });

    res.status(200).json({
      success: true,
      message: 'Comment unliked successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/comments/:postId
// @desc    Get comments for post
// @access  Public
exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: '-password',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};
