const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (e) {
      res.status(401).json({
        message: "User not authorized.",
      });
    }
  }
  if (!token)
    res.status(401).json({
      message: "User not authorized.",
    });
};

const restrictToRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) next();
    else
      res.status(401).json({
        message: "User not permitted.",
      });
  };
};

module.exports = { protect, restrictToRole };
