const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  media: [
    {
      mediaType: {
        type: String,
        enum: ['image', 'video'],
      },
      url: String,
      publicId: String,
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);
