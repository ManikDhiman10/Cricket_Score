const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, "abcdefgh", { expiresIn: '1h' });
};

module.exports = { generateToken };