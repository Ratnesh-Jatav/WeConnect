const jwt = require('jsonwebtoken');

const extractBearerToken = (authorizationHeader = '') => {
  if (!authorizationHeader.startsWith('Bearer ')) return null;
  return authorizationHeader.split(' ')[1] || null;
};

const auth = (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied' });
  }

  next();
};

module.exports = { auth, adminOnly };
