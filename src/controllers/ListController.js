const mongoose = require('mongoose');

const HTTPCode = require('../utils/HTTPCode');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');
const BoardInit = require('../models/Board');
const UserInit = require('../models/User');

const List = mongoose.model('List');
const Board = mongoose.model('Board');
const Card = mongoose.model('Card');
const User = mongoose.model('User');

module.exports = {
  async index(req, res) {
    const lists = await User.find({ _id: req.userId })
      .select('lists')
      .populate({
        path: 'boards',
        populate: {
          path: 'lists',
        },
      });
    return res.json(lists);
  },
  async store(req, res) {
    // Find Board
    const board = await Board.findById(req.body._board);
    // Create List
    const list = await List.create(req.body);
    // Verify if the list is saved
    if (!list) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    // Update Board
    board.lists.push(list);
    board.save();

    return res.status(HTTPCode.CREATED).json(list);
  },
  async show(req, res) {
    const list = await List.findById(req.params.id);
    if (!list) {
      res.sendStatus(HTTPCode.NOT_FOUND).json(list);
    }
    return res.json(list);
  },
  async update(req, res) {
    // Create List
    const list = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Verifica se já salvou
    if (!list) {
      res.sendStatus(HTTPCode.BAD_REQUEST);
    }

    return res.status(HTTPCode.OK).json(list);
  },
  async destroy(req, res) {
    // Delete list
    const list = await List.findByIdAndRemove(req.params.id);
    if (!list) {
      res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    // Delete the cards
    const cards = await Card.deleteMany({ _list: req.params.id });
    if (!cards) {
      res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    // Delete from board
    const board = await Board.findOne({ lists: list.id });
    board.lists = board.lists.filter(item => !item.equals(req.params.id));
    const boardRes = board.save();
    if (!boardRes) {
      res.sendStatus(HTTPCode.BAD_REQUEST);
    }

    return res.status(HTTPCode.OK).json(list);
  },
};
