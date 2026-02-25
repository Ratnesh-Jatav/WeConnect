const mongoose = require('mongoose');

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
    {
      imageUrl: String,
      publicId: String,
      caption: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
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
