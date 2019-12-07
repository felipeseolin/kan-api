const cache = require('../cache');

module.exports = function uncacheMany(routes) {
  return (req, res, next) => {
    routes.forEach((route) => {
      cache.del(route, (error, deleted) => {
        if (error) console.log(error);
        return deleted;
      });
    });
    next();
  };
};
