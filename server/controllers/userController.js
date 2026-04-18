const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const CLOSE_FRIEND_SELECT = 'name email profilePhoto relation location';

const getCurrentUserWithCloseFriends = (userId) =>
  User.findById(userId)
    .populate('closeFriends', CLOSE_FRIEND_SELECT)
    .populate('connections', CLOSE_FRIEND_SELECT);

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

exports.getCloseFriends = async (req, res) => {
  try {
    const user = await getCurrentUserWithCloseFriends(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      success: true,
      count: user.closeFriends.length,
      closeFriends: user.closeFriends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCloseFriendCandidates = async (req, res) => {
  try {
    const user = await getCurrentUserWithCloseFriends(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const selectedIds = new Set(user.closeFriends.map((friend) => friend._id.toString()));
    const candidates = user.connections.map((connection) => ({
      ...connection.toObject(),
      isCloseFriend: selectedIds.has(connection._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCloseFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot add yourself to close friends' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isConnection = user.connections.some((connectionId) => connectionId.toString() === userId);
    if (!isConnection) {
      return res.status(400).json({ message: 'Only connected family members can be added to close friends' });
    }

    if (!user.closeFriends.some((friendId) => friendId.toString() === userId)) {
      user.closeFriends.push(userId);
      await user.save();
    }

    const updatedUser = await getCurrentUserWithCloseFriends(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Close friend added successfully',
      closeFriends: updatedUser.closeFriends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeCloseFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.closeFriends = user.closeFriends.filter((friendId) => friendId.toString() !== userId);
    await user.save();

    const updatedUser = await getCurrentUserWithCloseFriends(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Close friend removed successfully',
      closeFriends: updatedUser.closeFriends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
