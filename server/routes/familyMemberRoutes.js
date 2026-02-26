const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} = require('../controllers/familyMemberController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAllMembers);
router.get('/:id', auth, getMember);
router.post('/', auth, addMember);
router.put('/:id', auth, updateMember);
router.delete('/:id', auth, deleteMember);

module.exports = router;
