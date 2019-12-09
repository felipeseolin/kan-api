const mongoose = require('mongoose');

const cache = require('../cache');
const HTTPCode = require('../utils/HTTPCode');
const BoardInit = require('../models/Board');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');
const UserInit = require('../models/User');

const Board = mongoose.model('Board');
const List = mongoose.model('List');
const Card = mongoose.model('Card');
const User = mongoose.model('User');

function validate(name, description) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Um nome deve ser dado ao quadro.'];
  }
  if (name && name.length > 100) {
    errors = [...errors, 'O nome deve ter ao máximo 100 caracteres.'];
  }
  if (name && name.length < 4) {
    errors = [...errors, 'O nome deve ter ao mínimo 4 caracteres.'];
  }
  if (description && description.length > 250) {
    errors = [...errors, 'A descrição deve ter ao máximo 250 caracteres.'];
  }

  return errors;
}

function validateAndRedirect(req, res) {
  const { name, description } = req.body;
  const error = validate(name, description);
  if (error.length > 0) {
    res.status(HTTPCode.BAD_REQUEST).send({ error });
  }
}

module.exports = {
  async index(req, res) {
    const boards = await Board.find({ _user: req.userId });
    return res.json(boards);
  },
  async store(req, res) {
    // Find User
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(HTTPCode.UNAUTHORIZED)
        .send({ error: 'Erro ao encontrar usuário' });
    }
    // Validate Board
    validateAndRedirect(req, res);
    // Create Board
    const board = await Board.create({ ...req.body, _user: req.userId });
    // Verify if the board is saved
    if (!board) {
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ error: 'Erro ao criar quadro' });
    }
    // Add board to user
    user.boards.push(board);
    user.save();

    return res.status(HTTPCode.CREATED).json(board);
  },
  async show(req, res) {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.sendStatus(HTTPCode.NOT_FOUND).json(board);
    }
    return res.status(HTTPCode.OK).json(board);
  },
  async update(req, res) {
    // Validate Board
    validateAndRedirect(req, res);
    req.params._user = undefined;
    // Update Board
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Verify if the board is saved
    if (!board) {
      return res.status(HTTPCode.BAD_REQUEST).json(board);
    }

    return res.status(HTTPCode.OK).json(board);
  },
  async destroy(req, res) {
    // Delete the board
    const board = await Board.findByIdAndRemove(req.params.id);
    // Delete all lists and cards
    const lists = await List.find({ _board: req.params.id });
    lists.map(async list => await Card.deleteMany({ _list: list._id }));
    await List.deleteMany({ _board: req.params.id });
    // Delete from user
    const user = await User.findById(req.userId);
    user.boards = user.boards.filter(item => !item.equals(req.params.id));
    user.save();

    return res.status(HTTPCode.OK).json(board);
  },
  async all(req, res) {
    const boards = await Board.findById(req.params.id).populate({
      path: 'lists',
      populate: {
        path: 'cards',
      },
    });
    return res.json(boards);
  },
};
