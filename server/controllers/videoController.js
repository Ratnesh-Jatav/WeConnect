const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

exports.getAllVideos = async (req, res) => {
  try {
    const { search, eventType, year } = req.query;

    let searchFilter = {};

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

    const publicVideos = await Video.find({ 
      isPublic: true,
      ...searchFilter 
    }).populate('userId', 'name email').sort({ createdAt: -1 });

    const ownedVideos = await Video.find({ 
      userId: req.user.id,
      ...searchFilter 
    }).sort({ createdAt: -1 });

    const allVideos = [...publicVideos];
    ownedVideos.forEach(video => {
      if (!allVideos.find(v => v._id.toString() === video._id.toString())) {
        allVideos.push(video);
      }
    });

    res.status(200).json({
      success: true,
      count: allVideos.length,
      videos: allVideos,
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

    const isOwner = video.userId.toString() === req.user.id;
    let isConnected = false;
    if (!isOwner) {
      const owner = await User.findById(video.userId);
      if (owner) {
        isConnected = owner.connections && owner.connections.some(id => id.toString() === req.user.id);
      }
    }

    if (!isOwner && !isConnected && !video.isPublic) {
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

    const file = req.files.video;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'video',
      folder: 'family-memory/videos',
      quality: 'auto'
    });

    const fs = require('fs');
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
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Upload Video Error:', error);
    res.status(500).json({ message: error.message });
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

    video = await Video.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
