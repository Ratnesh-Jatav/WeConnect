const mongoose = require('mongoose');

const MEDIA_VISIBILITY = Object.freeze({
  PUBLIC: 'public',
  PRIVATE: 'private',
});

const normalizeObjectId = (value) => {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (typeof value === 'object' && value._id) return value._id.toString();
  return String(value);
};

const dedupeObjectIds = (values = []) => {
  const seen = new Set();

  return values.reduce((accumulator, value) => {
    const normalized = normalizeObjectId(value);

    if (!normalized || seen.has(normalized) || !mongoose.Types.ObjectId.isValid(normalized)) {
      return accumulator;
    }

    seen.add(normalized);
    accumulator.push(normalized);
    return accumulator;
  }, []);
};

const toObjectIds = (values = []) => dedupeObjectIds(values).map((value) => new mongoose.Types.ObjectId(value));

const parseIdList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return dedupeObjectIds(value);

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return dedupeObjectIds(parsed);
      }
    } catch (error) {
      return dedupeObjectIds(
        trimmed
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      );
    }
  }

  return [];
};

const normalizeVisibilityInput = (value, fallback = MEDIA_VISIBILITY.PUBLIC) => {
  return value === MEDIA_VISIBILITY.PRIVATE ? MEDIA_VISIBILITY.PRIVATE : fallback;
};

const getMediaVisibility = (item = {}, fallbackPublic = false) => {
  if (item.visibility === MEDIA_VISIBILITY.PUBLIC || item.visibility === MEDIA_VISIBILITY.PRIVATE) {
    return item.visibility;
  }

  return fallbackPublic ? MEDIA_VISIBILITY.PUBLIC : MEDIA_VISIBILITY.PRIVATE;
};

const getAllowedUsers = (item = {}, fallbackUsers = []) => {
  if (Array.isArray(item.allowedUsers) && item.allowedUsers.length > 0) {
    return dedupeObjectIds(item.allowedUsers);
  }

  return dedupeObjectIds(fallbackUsers);
};

const canAccessScopedMedia = ({ ownerId, item, requesterId, requesterRole, fallbackPublic = false, fallbackUsers = [] }) => {
  if (!requesterId) return false;
  if (requesterRole === 'admin') return true;

  const normalizedOwnerId = normalizeObjectId(ownerId);
  const normalizedRequesterId = normalizeObjectId(requesterId);

  if (normalizedOwnerId && normalizedOwnerId === normalizedRequesterId) {
    return true;
  }

  const visibility = getMediaVisibility(item, fallbackPublic);
  if (visibility === MEDIA_VISIBILITY.PUBLIC) {
    return true;
  }

  return getAllowedUsers(item, fallbackUsers).includes(normalizedRequesterId);
};

const sanitizePhotoForViewer = (album, photo) => {
  const normalizedPhoto = photo.toObject ? photo.toObject() : { ...photo };
  normalizedPhoto.visibility = getMediaVisibility(normalizedPhoto, album.isPublic);
  normalizedPhoto.allowedUsers = getAllowedUsers(normalizedPhoto, album.sharedWith);
  return normalizedPhoto;
};

const getAccessiblePhotos = (album, requesterId, requesterRole) => {
  const photos = Array.isArray(album.photos) ? album.photos : [];

  return photos
    .filter((photo) =>
      canAccessScopedMedia({
        ownerId: album.userId,
        item: photo,
        requesterId,
        requesterRole,
        fallbackPublic: album.isPublic,
        fallbackUsers: album.sharedWith,
      }))
    .map((photo) => sanitizePhotoForViewer(album, photo));
};

const sanitizeAlbumForViewer = (album, requesterId, requesterRole) => {
  const normalizedAlbum = album.toObject ? album.toObject() : { ...album };
  const accessiblePhotos = getAccessiblePhotos(album, requesterId, requesterRole);

  normalizedAlbum.photos = accessiblePhotos;
  normalizedAlbum.photoCount = accessiblePhotos.length;
  normalizedAlbum.coverImage =
    accessiblePhotos[0]?.imageUrl ||
    normalizedAlbum.coverImage ||
    null;

  return normalizedAlbum;
};

const videoQueryForUser = (requesterId, requesterRole) => {
  if (requesterRole === 'admin') {
    return {};
  }

  return {
    $or: [
      { userId: new mongoose.Types.ObjectId(requesterId) },
      { visibility: MEDIA_VISIBILITY.PUBLIC },
      { allowedUsers: new mongoose.Types.ObjectId(requesterId) },
      { isPublic: true },
      { sharedWith: new mongoose.Types.ObjectId(requesterId) },
    ],
  };
};

module.exports = {
  MEDIA_VISIBILITY,
  canAccessScopedMedia,
  dedupeObjectIds,
  getAccessiblePhotos,
  normalizeVisibilityInput,
  parseIdList,
  sanitizeAlbumForViewer,
  toObjectIds,
  videoQueryForUser,
};
