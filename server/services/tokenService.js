const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || process.env.JWT_EXPIRE || '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

const getAccessTokenSecret = () => process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const hashToken = (value) => crypto.createHash('sha256').update(value).digest('hex');

const createAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    type: user.role === 'admin' ? 'admin' : 'user',
  };

  return jwt.sign(payload, getAccessTokenSecret(), { expiresIn: ACCESS_TOKEN_EXPIRE });
};

const buildRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
});

const mintRefreshToken = async ({ userId, ip, userAgent }) => {
  const rawToken = crypto.randomBytes(64).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId,
    tokenHash,
    expiresAt,
    createdByIp: ip || null,
    userAgent: userAgent || null,
  });

  return rawToken;
};

const rotateRefreshToken = async ({ previousRawToken, userId, ip, userAgent }) => {
  const previousHash = hashToken(previousRawToken);
  const existingToken = await RefreshToken.findOne({ tokenHash: previousHash, userId });

  if (!existingToken || existingToken.revokedAt || existingToken.expiresAt <= new Date()) {
    return null;
  }

  const nextRawToken = crypto.randomBytes(64).toString('hex');
  const nextHash = hashToken(nextRawToken);

  existingToken.revokedAt = new Date();
  existingToken.revokedByIp = ip || null;
  existingToken.replacedByTokenHash = nextHash;
  await existingToken.save();

  await RefreshToken.create({
    userId,
    tokenHash: nextHash,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    createdByIp: ip || null,
    userAgent: userAgent || null,
  });

  return nextRawToken;
};

const revokeRefreshToken = async ({ rawToken, ip }) => {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  const existingToken = await RefreshToken.findOne({ tokenHash });
  if (!existingToken || existingToken.revokedAt) return;

  existingToken.revokedAt = new Date();
  existingToken.revokedByIp = ip || null;
  await existingToken.save();
};

const findValidRefreshToken = async (rawToken) => {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);
  return RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
};

module.exports = {
  createAccessToken,
  mintRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  findValidRefreshToken,
  buildRefreshCookieOptions,
};
