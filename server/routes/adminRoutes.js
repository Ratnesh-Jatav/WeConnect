const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const adminCtrl = require('../controllers/adminController');

// Protected admin routes
router.get('/stats', auth, adminOnly, adminCtrl.getStats);
router.get('/users', auth, adminOnly, adminCtrl.getAllUsers);
router.get('/user/:id/posts', auth, adminOnly, adminCtrl.getUserPosts);

router.delete('/delete-user/:id', auth, adminOnly, adminCtrl.deleteUser);
router.delete('/delete-post/:id', auth, adminOnly, adminCtrl.deletePost);

// Admin management for albums/videos used by frontend admin
router.get('/albums', auth, adminOnly, async (req, res) => {
  const Album = require('../models/Album');
  try {
    const albums = await Album.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ albums });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch albums' });
  }
});

router.delete('/albums/:id', auth, adminOnly, adminCtrl.deleteAlbum);

router.get('/videos', auth, adminOnly, async (req, res) => {
  const Video = require('../models/Video');
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

router.delete('/videos/:id', auth, adminOnly, adminCtrl.deleteVideo);

module.exports = router;
