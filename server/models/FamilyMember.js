const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    enum: ['mother', 'father', 'brother', 'sister', 'spouse', 'child', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
