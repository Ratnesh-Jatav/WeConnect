const fs = require('fs');
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const {
  MEDIA_VISIBILITY,
  canAccessScopedMedia,
  normalizeVisibilityInput,
  parseIdList,
  toObjectIds,
  videoQueryForUser,
} = require('../utils/mediaAccess');

const validateAllowedUsers = (owner, visibility, allowedUsers) => {
  if (visibility !== MEDIA_VISIBILITY.PRIVATE) {
    return [];
  }

  const closeFriendIds = new Set((owner.closeFriends || []).map((id) => id.toString()));
  const invalidUserIds = allowedUsers.filter((userId) => !closeFriendIds.has(userId));

  if (invalidUserIds.length > 0) {
    const error = new Error('Private videos can only be shared with users from your close friends list');
    error.statusCode = 400;
    throw error;
  }

  if (allowedUsers.length === 0) {
    const error = new Error('Select at least one close friend for private videos');
    error.statusCode = 400;
    throw error;
  }

  return toObjectIds(allowedUsers);
};

exports.getAllVideos = async (req, res) => {
  try {
    const { search, eventType, year } = req.query;

    const searchFilter = {};

    if (search) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    if (eventType) {
      searchFilter.eventType = eventType;
    }

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      searchFilter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const videos = await Video.find({
      ...searchFilter,
      ...videoQueryForUser(req.user.id, req.user.role),
    })
      .populate('userId', 'name email profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const hasAccess = canAccessScopedMedia({
      ownerId: video.userId,
      item: video,
      requesterId: req.user.id,
      requesterRole: req.user.role,
      fallbackPublic: video.isPublic,
      fallbackUsers: video.sharedWith,
    });

    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, eventType } = req.body;

    if (!title || !req.files || !req.files.video) {
      return res.status(400).json({ message: 'Title and video file are required' });
    }

    const owner = await User.findById(req.user.id).select('closeFriends');
    if (!owner) {
      return res.status(404).json({ message: 'User not found' });
    }

    const visibility = normalizeVisibilityInput(req.body.visibility, MEDIA_VISIBILITY.PUBLIC);
    const allowedUserIds = parseIdList(req.body.allowedUsers);
    const allowedUsers = validateAllowedUsers(owner, visibility, allowedUserIds);
    const file = req.files.video;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'video',
      folder: 'family-memory/videos',
      quality: 'auto'
    });

    if (fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }

    const video = await Video.create({
      userId: req.user.id,
      title,
      description,
      eventType,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      thumbnail: result.thumbnail_url,
      visibility,
      allowedUsers,
      isPublic: visibility === MEDIA_VISIBILITY.PUBLIC,
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Upload Video Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const owner = await User.findById(req.user.id).select('closeFriends');
    if (!owner) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = { ...req.body, updatedAt: Date.now() };

    if (Object.prototype.hasOwnProperty.call(req.body, 'visibility')) {
      const visibility = normalizeVisibilityInput(req.body.visibility, MEDIA_VISIBILITY.PUBLIC);
      const allowedUserIds = parseIdList(req.body.allowedUsers);
      updates.visibility = visibility;
      updates.allowedUsers = validateAllowedUsers(owner, visibility, allowedUserIds);
      updates.isPublic = visibility === MEDIA_VISIBILITY.PUBLIC;
    }

    video = await Video.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Video deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
