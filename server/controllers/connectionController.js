const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const Album = require('../models/Album');
const Video = require('../models/Video');

const hasId = (idList = [], id) => idList.some((item) => item.toString() === id.toString());

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }

    const regex = { $regex: q, $options: 'i' };

    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
    }).select('name email profilePhoto');

    // Do not include the requesting user in results
    const filtered = users.filter(u => u._id.toString() !== req.user.id);

    res.status(200).json({ success: true, count: filtered.length, users: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send connection request to :userId
exports.sendRequest = async (req, res) => {
  try {
    const targetId = req.params.userId;
    const requesterId = req.user.id;

    if (requesterId === targetId) {
      return res.status(400).json({ message: "Can't send request to yourself" });
    }

    const target = await User.findById(targetId);
    const requester = await User.findById(requesterId);

    if (!target || !requester) return res.status(404).json({ message: 'User not found' });

    // Already connected?
    if (hasId(target.connections, requesterId) || hasId(requester.connections, targetId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    // Already requested
    if (hasId(target.connectionRequests, requesterId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // Push request into target's incoming requests
    target.connectionRequests.push(requesterId);
    await target.save();

    res.status(200).json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept connection request from :userId
exports.acceptRequest = async (req, res) => {
  try {
    const requesterId = req.params.userId; // user who sent the request
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);
    const requester = await User.findById(requesterId);

    if (!receiver || !requester) return res.status(404).json({ message: 'User not found' });

    // Ensure there is an incoming request
    if (!hasId(receiver.connectionRequests, requesterId)) {
      return res.status(400).json({ message: 'No incoming request from this user' });
    }

    // Remove from receiver's connectionRequests
    receiver.connectionRequests = receiver.connectionRequests.filter(id => id.toString() !== requesterId);

    // Add to each other's connections if not already present
    if (!hasId(receiver.connections, requesterId)) receiver.connections.push(requesterId);
    if (!hasId(requester.connections, receiverId)) requester.connections.push(receiverId);

    await receiver.save();
    await requester.save();

    res.status(200).json({ success: true, message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject connection request from :userId
exports.rejectRequest = async (req, res) => {
  try {
    const requesterId = req.params.userId;
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: 'User not found' });

    if (!hasId(receiver.connectionRequests, requesterId)) {
      return res.status(400).json({ message: 'No incoming request from this user' });
    }

    receiver.connectionRequests = receiver.connectionRequests.filter(id => id.toString() !== requesterId);
    await receiver.save();

    res.status(200).json({ success: true, message: 'Connection request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List connected users
exports.listConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('connections', 'name email profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, count: user.connections.length, connections: user.connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get content of a user (family members, albums, videos) only if allowed
exports.getUserContent = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const requesterId = req.user.id;

    const owner = await User.findById(ownerId);
    if (!owner) return res.status(404).json({ message: 'User not found' });

    const isOwner = ownerId === requesterId;
    const isConnected = owner.connections.some(id => id.toString() === requesterId);

    if (!isOwner && !isConnected) {
      return res.status(403).json({ message: 'Not authorized to view this user content' });
    }

    // Family members (owner's members)
    const members = await FamilyMember.find({ userId: ownerId }).sort({ createdAt: -1 });

    // Albums: include owner albums and filter by permission
    const albums = await Album.find({ userId: ownerId }).sort({ eventDate: -1 });

    // Videos: include owner videos
    const videos = await Video.find({ userId: ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      owner: { id: owner._id, name: owner.name, profilePhoto: owner.profilePhoto },
      members,
      albums,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get incoming connection requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('connectionRequests', 'name email profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, count: user.connectionRequests.length, requests: user.connectionRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
