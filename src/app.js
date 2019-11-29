const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
// Use .env file config
require('dotenv').config();
class AppController {
  constructor() {
    this.express = express();
    this.express.set('port', process.env.PORT || 5000);

    this.middlewares();
    this.routes();
    this.database();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
  }

  routes() {
    this.express.use('/api', routes);
  }

  database() {
    mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
    });
  }
}

module.exports = new AppController().express;
