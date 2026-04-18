const fs = require('fs');
const Album = require('../models/Album');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const {
  MEDIA_VISIBILITY,
  getAccessiblePhotos,
  normalizeVisibilityInput,
  parseIdList,
  sanitizeAlbumForViewer,
  toObjectIds,
} = require('../utils/mediaAccess');

const validateAllowedUsers = (owner, visibility, allowedUsers) => {
  if (visibility !== MEDIA_VISIBILITY.PRIVATE) {
    return [];
  }

  const closeFriendIds = new Set((owner.closeFriends || []).map((id) => id.toString()));
  const invalidUserIds = allowedUsers.filter((userId) => !closeFriendIds.has(userId));

  if (invalidUserIds.length > 0) {
    const error = new Error('Private media can only be shared with users from your close friends list');
    error.statusCode = 400;
    throw error;
  }

  if (allowedUsers.length === 0) {
    const error = new Error('Select at least one close friend for private photos');
    error.statusCode = 400;
    throw error;
  }

  return toObjectIds(allowedUsers);
};

const hasLegacyAlbumAccess = (album, requesterId, requesterRole) => {
  if (!requesterId) return false;
  if (requesterRole === 'admin') return true;
  if (album.userId.toString() === requesterId) return true;
  if (album.isPublic) return true;
  return (album.sharedWith || []).some((id) => id.toString() === requesterId);
};

exports.getAllAlbums = async (req, res) => {
  try {
    const { search, eventType, year } = req.query;
    const searchFilter = {};

    if (search) {
      searchFilter.title = { $regex: search, $options: 'i' };
    }

    if (eventType) {
      searchFilter.eventType = eventType;
    }

    if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      searchFilter.eventDate = { $gte: startDate, $lte: endDate };
    }

    const albums = await Album.find(searchFilter)
      .populate('userId', 'name email profilePhoto')
      .sort({ createdAt: -1 });

    const accessibleAlbums = albums
      .map((album) => {
        const normalizedAlbum = sanitizeAlbumForViewer(album, req.user.id, req.user.role);
        const hasAccessiblePhotos = normalizedAlbum.photos.length > 0;

        if (!hasAccessiblePhotos && !hasLegacyAlbumAccess(album, req.user.id, req.user.role)) {
          return null;
        }

        return normalizedAlbum;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: accessibleAlbums.length,
      albums: accessibleAlbums,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('userId', 'name email profilePhoto');

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const accessiblePhotos = getAccessiblePhotos(album, req.user.id, req.user.role);
    const hasAccess = accessiblePhotos.length > 0 || hasLegacyAlbumAccess(album, req.user.id, req.user.role);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized to access this album' });
    }

    res.status(200).json({
      success: true,
      album: sanitizeAlbumForViewer(album, req.user.id, req.user.role),
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

    const updates = {};
    ['title', 'description'].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (req.files && req.files.coverImage) {
      const file = req.files.coverImage;

      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: 'image',
          folder: 'family-memory/album-covers',
          quality: 'auto',
          fetch_format: 'auto',
        });

        if (fs.existsSync(file.tempFilePath)) {
          fs.unlinkSync(file.tempFilePath);
        }

        if (album.coverImagePublicId) {
          try {
            await cloudinary.uploader.destroy(album.coverImagePublicId);
          } catch (destroyError) {
            console.warn('Failed to remove old cover image from Cloudinary', destroyError.message || destroyError);
          }
        }

        updates.coverImage = result.secure_url;
        updates.coverImagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Cover upload failed', uploadError);
        return res.status(500).json({ message: 'Failed to upload cover image' });
      }
    } else if (Object.prototype.hasOwnProperty.call(req.body, 'coverImage')) {
      updates.coverImage = req.body.coverImage || null;
      if (!req.body.coverImage) {
        updates.coverImagePublicId = null;
      }
    }

    updates.updatedAt = Date.now();

    album = await Album.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      album,
    });
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
      return res.status(400).json({ message: 'No image provided' });
    }

    const owner = await User.findById(req.user.id).select('closeFriends');
    if (!owner) {
      return res.status(404).json({ message: 'User not found' });
    }

    const visibility = normalizeVisibilityInput(req.body.visibility, MEDIA_VISIBILITY.PUBLIC);
    const allowedUserIds = parseIdList(req.body.allowedUsers);
    const allowedUsers = validateAllowedUsers(owner, visibility, allowedUserIds);
    const file = req.files.image;
    const caption = req.body.caption || '';

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'image',
      folder: 'family-memory/albums',
      quality: 'auto',
      fetch_format: 'auto',
    });

    if (fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }

    album.photos.push({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption,
      visibility,
      allowedUsers,
    });

    if (!album.coverImage || visibility === MEDIA_VISIBILITY.PUBLIC) {
      album.coverImage = result.secure_url;
    }

    await album.save();

    const createdPhoto = album.photos[album.photos.length - 1];

    res.status(201).json({
      success: true,
      photo: {
        ...createdPhoto.toObject(),
        allowedUsers: allowedUserIds,
      },
    });
  } catch (error) {
    console.error('Upload Photo Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
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

    if (typeof isPublic === 'boolean') {
      album.isPublic = isPublic;
    }

    if (Array.isArray(userIds)) {
      const sharedWith = new Set((album.sharedWith || []).map((userId) => userId.toString()));
      userIds.forEach((userId) => sharedWith.add(userId.toString()));
      album.sharedWith = Array.from(sharedWith);
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
