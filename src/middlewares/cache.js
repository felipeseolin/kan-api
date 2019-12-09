const cache = require('../cache');
const HTTPCode = require('../utils/HTTPCode');

module.exports = (name) => (req, res, next) => {
  if (!req.userId) {
    res.status(HTTPCode.BAD_REQUEST).send({ error: 'No token provided' });
  }
  cache.route(`${req.userId}-${name}`);
  return next();
};
