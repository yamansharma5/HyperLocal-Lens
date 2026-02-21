import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  // Accept either a user object or a plain ID for flexibility in different contexts (e.g., after registration or login)
  const payload = typeof user === "object" && user._id 
    ? { id: user._id, role: user.role }
    : { id: user };

  return jwt.sign(payload, process.env.JWT_SECRET, {// Default to 7 days if not specified
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};