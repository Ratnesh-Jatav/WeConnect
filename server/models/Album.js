const mongoose = require('mongoose');
const { MEDIA_VISIBILITY } = require('../utils/mediaAccess');

const photoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
    trim: true,
  },
  visibility: {
    type: String,
    enum: Object.values(MEDIA_VISIBILITY),
    default: MEDIA_VISIBILITY.PUBLIC,
    index: true,
  },
  allowedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  _id: true,
});

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['wedding', 'birthday', 'festival', 'trip', 'anniversary', 'other'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  eventDate: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String,
    default: null,
  },
  coverImagePublicId: {
    type: String,
    default: null,
  },
  photos: [
    photoSchema,
  ],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Album', albumSchema);
