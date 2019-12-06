require('dotenv').config();
const cache = require('express-redis-cache')({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASSWORD,
  expire: 60,
});

module.exports = cache;
