const cacheConfig = require('../config/cacheConfig');
const cache = require('express-redis-cache')(cacheConfig);

module.exports = cache;
