const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} = require('../controllers/familyMemberController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getAllMembers);
router.get('/:id', auth, getMember);
// require auth first so req.user exists, then check adminOnly
router.post('/', auth, adminOnly, addMember);
router.put('/:id', auth, adminOnly, updateMember);
router.delete('/:id', auth, adminOnly, deleteMember);

module.exports = router;
