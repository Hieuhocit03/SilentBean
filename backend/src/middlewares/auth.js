// middleware/auth.js
const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Unauthorized access" });
    req.admin = decoded; // Lưu thông tin admin trong request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
