const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const connectionController = require('../controllers/connectionController');
const userController = require('../controllers/userController');

router.get('/:userId/content', auth, connectionController.getUserContent);

router.get('/:id/profile', auth, userController.getProfile);

router.put('/profile', auth, userController.updateProfile);

module.exports = router;
