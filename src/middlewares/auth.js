const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const HTTPCode = require('../utils/HTTPCode');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(HTTPCode.UNAUTHORIZED).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ error: 'Token malformatted' });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err)
      return res.status(HTTPCode.UNAUTHORIZED).send({ error: 'Token invalid' });

    req.userId = decoded.id;
    return next();
  });
};
