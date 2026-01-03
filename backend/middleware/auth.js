const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Token header format: Authorization: Bearer <token>
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, "SECRET_KEY");

    // Attach user info to request
    req.user = decoded;

    next(); // Move to next handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
