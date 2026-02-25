const express = require('express');
const router = express.Router();
const {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadPhoto,
  deletePhoto,
  shareAlbum,
} = require('../controllers/albumController');
const { auth } = require('../middleware/auth');
const { ownerOrAdmin } = require('../middleware/ownership');

router.get('/', auth, getAllAlbums);
router.get('/:id', auth, getAlbum);
router.post('/', auth, createAlbum);
router.put('/:id', auth, ownerOrAdmin('Album', 'id'), updateAlbum);
router.delete('/:id', auth, ownerOrAdmin('Album', 'id'), deleteAlbum);
router.post('/:id/share', auth, shareAlbum);
router.post('/:id/photos', auth, uploadPhoto);
router.delete('/:albumId/photos/:photoId', auth, deletePhoto);

module.exports = router;
