const FamilyMember = require('../models/FamilyMember');

exports.getAllMembers = async (req, res) => {
  try {
    const { search, relation } = req.query;

    let query = { userId: req.user.id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (relation) {
      query.relation = relation;
    }

    const members = await FamilyMember.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    if (member.userId.toString() !== req.user.id) {
      const User = require('../models/User');
      const owner = await User.findById(member.userId);
      const isConnected = owner && owner.connections && owner.connections.some(id => id.toString() === req.user.id);
      if (!isConnected) {
        return res.status(403).json({ message: 'Not authorized to access this member' });
      }
    }

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, relation, dateOfBirth, bio, email, phone, address } = req.body;

    if (!name || !relation) {
      return res.status(400).json({ message: 'Name and relation are required' });
    }

    const member = await FamilyMember.create({
      userId: req.user.id,
      name,
      relation,
      dateOfBirth,
      bio,
      email,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    let member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    if (member.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this member' });
    }

    member = await FamilyMember.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    if (member.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this member' });
    }

    await FamilyMember.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Family member deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
