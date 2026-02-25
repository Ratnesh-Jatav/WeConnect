const mongoose = require('mongoose');

// ownerOrAdmin middleware factory
// modelName: filename under models folder (e.g. 'Album')
// paramName: route param that contains id (default: 'id')
module.exports.ownerOrAdmin = (modelName, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const id = req.params[paramName];
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

      // require model dynamically
      // eslint-disable-next-line global-require
      const Model = require(`../models/${modelName}`);
      const doc = await Model.findById(id);
      if (!doc) return res.status(404).json({ message: `${modelName} not found` });

      // allow admin
      if (req.user && req.user.role === 'admin') {
        req.resource = doc;
        return next();
      }

      // check ownership - assume owner field is userId
      if (doc.userId && doc.userId.toString() === req.user.id) {
        req.resource = doc;
        return next();
      }

      return res.status(403).json({ message: 'Not authorized' });
    } catch (error) {
      console.error('ownership middleware error', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};
