const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Get public profile by user id (read-only)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('name relation bio location profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, profile: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update current user's profile (can include profile photo upload)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update allowed fields
    const { name, relation, bio, location } = req.body;
    if (name !== undefined) user.name = name;
    if (relation !== undefined) user.relation = relation;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    // If a file is uploaded via express-fileupload (server uses that middleware)
    if (req.files && req.files.profilePhoto) {
      const file = req.files.profilePhoto;
      // Upload to Cloudinary using temporary file path
      const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: 'profiles' });
      user.profilePhoto = result.secure_url;
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
