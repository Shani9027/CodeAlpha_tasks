const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretjwt', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
