const Album = require('../models/Album');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

exports.getAllAlbums = async (req, res) => {
  try {
    const { search, eventType, year } = req.query;

    let searchFilter = {};
    if (search) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }
    if (eventType) {
      searchFilter.eventType = eventType;
    }
     Album.find({
      isPublic: true, 

     })

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      searchFilter.eventDate = { $gte: startDate, $lte: endDate };
    }

    const publicAlbums = await Album.find({
      isPublic: true,
      ...searchFilter,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const ownedAlbums = await Album.find({
      userId: req.user.id,
      ...searchFilter,
    }).sort({ createdAt: -1 });

    const sharedAlbums = await Album.find({
      sharedWith: req.user.id,
      ...searchFilter,
    }).sort({ createdAt: -1 });

    const allAlbums = [...publicAlbums];

    ownedAlbums.forEach(album => {
      if (!allAlbums.find(a => a._id.toString() === album._id.toString())) {
        allAlbums.push(album);
      }
    });

    sharedAlbums.forEach(album => {
      if (!allAlbums.find(a => a._id.toString() === album._id.toString())) {
        allAlbums.push(album);
      }
    });

    res.status(200).json({
      success: true,
      count: allAlbums.length,
      albums: allAlbums,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const isOwner = album.userId.toString() === req.user.id;
    const isPublic = album.isPublic;
    const isShared = album.sharedWith && album.sharedWith.some(id => id.toString() === req.user.id);

    let isConnected = false;
    if (!isOwner) {
      const owner = await User.findById(album.userId);
      if (owner) {
        isConnected = owner.connections && owner.connections.some(id => id.toString() === req.user.id);
      }
    }

    if (!isOwner && !isPublic && !isShared && !isConnected) {
      return res.status(403).json({ message: 'Not authorized to access this album' });
    }

    res.status(200).json({
      success: true,
      album,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const { title, eventType, description, eventDate } = req.body;

    if (!title || !eventType || !eventDate) {
      return res.status(400).json({ message: 'Title, eventType, and eventDate are required' });
    }

    const album = await Album.create({
      userId: req.user.id,
      title,
      eventType,
      description,
      eventDate,
    });

    res.status(201).json({
      success: true,
      album,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    let album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    const isOwner = album.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this album' });
    }

    const allowedFields = ['title', 'description'];
    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (updates.title && typeof updates.title !== 'string') {
      return res.status(400).json({ message: 'Invalid title' });
    }

    if (updates.description && typeof updates.description !== 'string') {
      return res.status(400).json({ message: 'Invalid description' });
    }

    if (req.files && req.files.coverImage) {
      const file = req.files.coverImage;
      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: 'image',
          folder: 'family-memory/album-covers',
          quality: 'auto',
          fetch_format: 'auto',
        });

        const fs = require('fs');
        if (fs.existsSync(file.tempFilePath)) fs.unlinkSync(file.tempFilePath);

        if (album.coverImagePublicId) {
          try {
            await cloudinary.uploader.destroy(album.coverImagePublicId);
          } catch (err) {
            console.warn('Failed to remove old cover image from cloudinary', err.message || err);
          }
        }

        updates.coverImage = result.secure_url;
        updates.coverImagePublicId = result.public_id;
      } catch (err) {
        console.error('Cover upload failed', err);
        return res.status(500).json({ message: 'Failed to upload cover image' });
      }
    } else if (Object.prototype.hasOwnProperty.call(req.body, 'coverImage')) {
      if (!req.body.coverImage) {
        if (album.coverImagePublicId) {
          try {
            await cloudinary.uploader.destroy(album.coverImagePublicId);
          } catch (err) {
            console.warn('Failed to remove old cover image from cloudinary', err.message || err);
          }
        }
        updates.coverImage = null;
        updates.coverImagePublicId = null;
      } else if (typeof req.body.coverImage === 'string') {
        updates.coverImage = req.body.coverImage;
        updates.coverImagePublicId = album.coverImagePublicId || null;
      }
    }

    updates.updatedAt = Date.now();

    album = await Album.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({ success: true, album });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const isOwner = album.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this album' });
    }

    for (const photo of album.photos) {
      if (photo.publicId) {
        await cloudinary.uploader.destroy(photo.publicId);
      }
    }

    await Album.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Album deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.files || !req.files.image) {
      console.error('Files:', req.files);
      return res.status(400).json({ message: 'No image provided' });
    }

    const file = req.files.image;
    const caption = req.body.caption || '';

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'image',
      folder: 'family-memory/albums',
      quality: 'auto',
      fetch_format: 'auto'
    });

    const fs = require('fs');
    if (fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }

    const photo = {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption,
    };

    album.photos.push(photo);
    if (!album.coverImage) {
      album.coverImage = result.secure_url;
    }

    await album.save();

    res.status(201).json({
      success: true,
      photo,
    });
  } catch (error) {
    console.error('Upload Photo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { albumId, photoId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const photo = album.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    album.photos.id(photoId).deleteOne();
    await album.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.shareAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds, isPublic } = req.body;

    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to share this album' });
    }

    if (isPublic !== undefined) {
      album.isPublic = isPublic;
    }

    if (userIds && Array.isArray(userIds)) {
      userIds.forEach(userId => {
        if (!album.sharedWith.includes(userId)) {
          album.sharedWith.push(userId);
        }
      });
    }

    await album.save();

    res.status(200).json({
      success: true,
      message: 'Album shared successfully',
      album,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
