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

function validate(name, email, password, passwordConfirm) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Um nome é necessário.'];
  }
  if (name.length < 5) {
    errors = [...errors, 'Um nome válido deve ter ao menos 5 caracteres.'];
  }
  if (!/^[a-zA-Z ]+$/.test(name)) {
    errors = [...errors, 'Forneça um nome válido.'];
  }
  if (!email || email.trim().length === 0) {
    errors = [...errors, 'É necessário inserir um e-mail.'];
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    errors = [...errors, 'Forneça um e-mail válido.'];
  }
  if (password !== passwordConfirm) {
    errors = [...errors, 'As senhas fornecidas não conferem.'];
  }
  if (!password || password.trim().length === 0) {
    errors = [...errors, 'É necessário inserir uma senha.'];
  }
  if (password && password.length < 6) {
    errors = [...errors, 'A senha deve possuir ao mínimo 6 caracteres.'];
  }

  return errors;
}

module.exports = {
  async register(req, res) {
    const { name, email, password, passwordConfirm } = req.body;
    if (await User.findOne({ email })) {
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ error: 'User already exists' });
    }
    // Validate User
    console.log(password);
    console.log(passwordConfirm);
    const error = validate(name, email, password, passwordConfirm);
    if (error.length > 0) {
      return res.status(HTTPCode.BAD_REQUEST).send({ error });
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
