const jwt = require('jsonwebtoken');

// Use the same secret key as your login/signup route
const jwtSecret = process.env.JWT_SECRET || 'your_very_secure_secret_key_here';

const authenticateToken = (req, res, next) => {
  try {
    // Token can come from Authorization header, cookies, or query
    let token;

    // Check Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Optional: If using cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Optional: If token passed via query param
    if (!token && req.query && req.query.token) {
      token = req.query.token;
    }

    // If no token found
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
      // Attach decoded payload to request
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Token authentication error:', error.message);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = authenticateToken;
