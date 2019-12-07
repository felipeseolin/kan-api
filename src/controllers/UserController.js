const mongoose = require('mongoose');

const UserInit = require('../models/User');
const BoardInit = require('../models/Board');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');

const User = mongoose.model('User');
const Board = mongoose.model('Board');
const List = mongoose.model('List');
const Card = mongoose.model('Card');

const HTTPCode = require('../utils/HTTPCode');

module.exports = {
  async register(req, res) {
    const { email } = req.body;
    if (await User.findOne({ email })) {
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ error: 'User already exists' });
    }
    // Create User
    const user = await User.create(req.body);
    // Verify if the user is saved
    if (!user) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    user.password = undefined;

    return res.status(HTTPCode.CREATED).json(user);
  },
};
