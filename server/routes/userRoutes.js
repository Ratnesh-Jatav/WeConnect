const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const connectionController = require('../controllers/connectionController');
const userController = require('../controllers/userController');

// Get a user's shared content (family members, albums, videos) if connected or owner
router.get('/:userId/content', auth, connectionController.getUserContent);

// Public profile preview for another user (read-only). Requires auth.
router.get('/:id/profile', auth, userController.getProfile);

// Update current user's profile (edit own profile). Accepts form-data with optional `profilePhoto` file.
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
