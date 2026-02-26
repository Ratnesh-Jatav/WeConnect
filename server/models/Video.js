const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,

  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['wedding', 'birthday', 'festival', 'trip', 'anniversary', 'general', 'other'],
    default: 'general',
  },
  duration: Number,
  thumbnail: String,
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', videoSchema);
