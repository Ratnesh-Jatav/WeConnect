const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/connectionController');

// Search users
router.get('/search', auth, controller.searchUsers);

// Send request
router.post('/request/:userId', auth, controller.sendRequest);

// Accept request
router.post('/accept/:userId', auth, controller.acceptRequest);

// Reject request
router.post('/reject/:userId', auth, controller.rejectRequest);

// List connections
router.get('/', auth, controller.listConnections);

// Incoming requests
router.get('/requests/incoming', auth, controller.getIncomingRequests);

module.exports = router;
