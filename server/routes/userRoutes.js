const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const connectionController = require('../controllers/connectionController');
const userController = require('../controllers/userController');

router.get('/close-friends', auth, userController.getCloseFriends);
router.get('/close-friends/candidates', auth, userController.getCloseFriendCandidates);
router.post('/close-friends/:userId', auth, userController.addCloseFriend);
router.delete('/close-friends/:userId', auth, userController.removeCloseFriend);

router.get('/:userId/content', auth, connectionController.getUserContent);

router.get('/:id/profile', auth, userController.getProfile);

router.put('/profile', auth, userController.updateProfile);

module.exports = router;
