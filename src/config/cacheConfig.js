require('dotenv').config();

module.exports = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASSWORD,
  expire: 60,
};
