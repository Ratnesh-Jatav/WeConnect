const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAllVideos);
router.get('/:id', auth, getVideo);
router.post('/', auth, uploadVideo);
router.put('/:id', auth, updateVideo);
router.delete('/:id', auth, deleteVideo);

module.exports = router;
