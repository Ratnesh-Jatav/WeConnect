const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/connectionController');

router.get('/search', auth, controller.searchUsers);

router.post('/request/:userId', auth, controller.sendRequest);

router.post('/accept/:userId', auth, controller.acceptRequest);

router.post('/reject/:userId', auth, controller.rejectRequest);

router.get('/', auth, controller.listConnections);

router.get('/requests/incoming', auth, controller.getIncomingRequests);

module.exports = router;
