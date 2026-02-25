const User = require('../models/User');
const Post = require('../models/Post');
const Album = require('../models/Album');
const Video = require('../models/Video');
const RefreshToken = require('../models/RefreshToken');
const cloudinary = require('../config/cloudinary');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlbums = await Album.countDocuments();
    const totalVideos = await Video.countDocuments();

    // Count photos from albums and posts media
    const albums = await Album.find({}, 'photos');
    let totalPhotos = 0;
    albums.forEach((a) => {
      if (Array.isArray(a.photos)) totalPhotos += a.photos.length;
    });

    const posts = await Post.find({}, 'media');
    posts.forEach((p) => {
      if (Array.isArray(p.media)) totalPhotos += p.media.filter((m) => m.mediaType === 'image').length;
    });

    res.json({ stats: { totalUsers, totalAlbums, totalPhotos, totalVideos } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to collect stats' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name email role createdAt');

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// GET /api/admin/user/:id/posts
const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ userId: id }).sort({ createdAt: -1 });
    const albums = await Album.find({ userId: id }).sort({ createdAt: -1 });
    const videos = await Video.find({ userId: id }).sort({ createdAt: -1 });

    res.json({ posts, albums, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get user content' });
  }
};

// DELETE /api/admin/delete-user/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete posts and their media
    const posts = await Post.find({ userId: id });
    for (const p of posts) {
      if (Array.isArray(p.media)) {
        for (const m of p.media) {
          try {
            if (m.publicId) {
              await cloudinary.uploader.destroy(m.publicId, { resource_type: m.mediaType === 'video' ? 'video' : 'image' });
            }
          } catch (err) {
            console.warn('Failed to remove media from cloudinary', err.message || err);
          }
        }
      }
    }
    await Post.deleteMany({ userId: id });

    // Delete albums and their photos
    const albums = await Album.find({ userId: id });
    for (const a of albums) {
      if (Array.isArray(a.photos)) {
        for (const ph of a.photos) {
          try {
            if (ph.publicId) await cloudinary.uploader.destroy(ph.publicId);
          } catch (err) {
            console.warn('Failed to remove album photo from cloudinary', err.message || err);
          }
        }
      }
    }
    await Album.deleteMany({ userId: id });

    // Delete videos and their cloudinary entries
    const videos = await Video.find({ userId: id });
    for (const v of videos) {
      try {
        if (v.publicId) await cloudinary.uploader.destroy(v.publicId, { resource_type: 'video' });
      } catch (err) {
        console.warn('Failed to remove video from cloudinary', err.message || err);
      }
    }
    await Video.deleteMany({ userId: id });

    // Delete refresh tokens
    await RefreshToken.deleteMany({ userId: id });

    // Finally delete user
    await User.findByIdAndDelete(id);

    res.json({ message: 'User and content deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// DELETE /api/admin/delete-post/:id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (Array.isArray(post.media)) {
      for (const m of post.media) {
        try {
          if (m.publicId) await cloudinary.uploader.destroy(m.publicId, { resource_type: m.mediaType === 'video' ? 'video' : 'image' });
        } catch (err) {
          console.warn('Failed to remove post media from cloudinary', err.message || err);
        }
      }
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// DELETE /api/admin/albums/:id
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (Array.isArray(album.photos)) {
      for (const ph of album.photos) {
        try {
          if (ph.publicId) await cloudinary.uploader.destroy(ph.publicId);
        } catch (err) {
          console.warn('Failed to remove album photo from cloudinary', err.message || err);
        }
      }
    }

    await Album.findByIdAndDelete(id);
    res.json({ message: 'Album deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete album' });
  }
};

// DELETE /api/admin/videos/:id
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    try {
      if (video.publicId) await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    } catch (err) {
      console.warn('Failed to remove video from cloudinary', err.message || err);
    }

    await Video.findByIdAndDelete(id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getUserPosts,
  deleteUser,
  deletePost,
  deleteAlbum,
  deleteVideo,
};

// GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalVideos, totalPosts, photosAgg] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Post.countDocuments(),
      Album.aggregate([
        { $project: { photoCount: { $size: '$photos' } } },
        { $group: { _id: null, totalPhotos: { $sum: '$photoCount' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalPhotos: photosAgg[0]?.totalPhotos || 0,
        totalVideos,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
