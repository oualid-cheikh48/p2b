// Importer jsonwebtoken
const jwt = require("jsonwebtoken");

// Generer token avec payload et secret
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Verifier token et retourner payload
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };