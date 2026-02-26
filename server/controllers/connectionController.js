const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const Album = require('../models/Album');
const Video = require('../models/Video');

const hasId = (idList = [], id) => idList.some((item) => item.toString() === id.toString());

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

    const filtered = users.filter(u => u._id.toString() !== req.user.id);

    res.status(200).json({ success: true, count: filtered.length, users: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    if (hasId(target.connections, requesterId) || hasId(requester.connections, targetId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    if (hasId(target.connectionRequests, requesterId)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    target.connectionRequests.push(requesterId);
    await target.save();

    res.status(200).json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const requesterId = req.params.userId; // user who sent the request
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);
    const requester = await User.findById(requesterId);

    if (!receiver || !requester) return res.status(404).json({ message: 'User not found' });

    if (!hasId(receiver.connectionRequests, requesterId)) {
      return res.status(400).json({ message: 'No incoming request from this user' });
    }

    receiver.connectionRequests = receiver.connectionRequests.filter(id => id.toString() !== requesterId);

    if (!hasId(receiver.connections, requesterId)) receiver.connections.push(requesterId);
    if (!hasId(requester.connections, receiverId)) requester.connections.push(receiverId);

    await receiver.save();
    await requester.save();

    res.status(200).json({ success: true, message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.listConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('connections', 'name email profilePhoto');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, count: user.connections.length, connections: user.connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const members = await FamilyMember.find({ userId: ownerId }).sort({ createdAt: -1 });

    const albums = await Album.find({ userId: ownerId }).sort({ eventDate: -1 });

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
