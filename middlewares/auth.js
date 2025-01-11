const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  const token = req.headers["authorization"]; // Token should be passed in the "Authorization" header
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET); // Token format: "Bearer <token>"
    req.user = decoded; // Attach user details to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to check authorization based on role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = { checkAuth, checkRole };
