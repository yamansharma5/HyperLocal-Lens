// Role middleware
export const authorizeBusiness = (req, res, next) => {
  if (req.user.role !== "business") {
    return res.status(403).json({
      message: "Access denied. Only business accounts allowed.",
    });
  }
  next();
};