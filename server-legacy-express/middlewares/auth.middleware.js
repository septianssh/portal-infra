import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const verifyRole = (requiredRoles) => {
  return (req, res, next) => {
    const roles = req.body.roles;
    if (!roles || !requiredRoles.some(role => roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}


export { authMiddleware, verifyRole };
