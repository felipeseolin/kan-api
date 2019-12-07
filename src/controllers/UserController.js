const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const UserInit = require('../models/User');
const BoardInit = require('../models/Board');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');

const User = mongoose.model('User');
const Board = mongoose.model('Board');
const List = mongoose.model('List');
const Card = mongoose.model('Card');

const HTTPCode = require('../utils/HTTPCode');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

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

    const token = generateToken({ id: user.id });
    return res.status(HTTPCode.CREATED).json({ user, token });
  },
  async authenticate(req, res) {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email }).select('+password');
    // User not found
    if (!user) {
      res.status(HTTPCode.BAD_REQUEST).send({ error: 'User not found' });
    }
    // Password does not match
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(HTTPCode.BAD_REQUEST).send({ error: 'Invalid password' });
    }
    user.password = undefined;

    const token = generateToken({ id: user.id });
    return res.status(HTTPCode.OK).json({ user, token });
  },
};
