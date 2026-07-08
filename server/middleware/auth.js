const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'theta-learn-secret-key-2024';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
}

// Alias used throughout the project
const requireAuth = authenticateToken;

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden'
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireAuth,
  requireRole,
  JWT_SECRET
};