const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, relation, bio, location } = req.body;
    if (name !== undefined) user.name = name;
    if (relation !== undefined) user.relation = relation;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    if (req.files && req.files.profilePhoto) {
      const file = req.files.profilePhoto;
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
