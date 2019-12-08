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

module.exports = {
  async index(req, res) {
    const boards = await Board.find({ _user: req.userId });
    return res.json(boards);
  },
  async store(req, res) {
    // Find User
    const user = await User.findById(req.userId);
    if (!user) {
      return res.sendStatus(HTTPCode.UNAUTHORIZED);
    }
    // Create Board
    const board = await Board.create({ ...req.body, _user: req.userId });
    // Verify if the board is saved
    if (!board) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
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
