import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  // console.log(`Recieved the token:${token}`);

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // store user id in request
    next(); // pass control to next middleware or controller
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default verifyToken;