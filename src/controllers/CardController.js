const mongoose = require('mongoose');

const HTTPCode = require('../utils/HTTPCode');
const CardInit = require('../models/Card');
const ListInit = require('../models/List');
const UserInit = require('../models/User');

const Card = mongoose.model('Card');
const List = mongoose.model('List');
const User = mongoose.model('User');

module.exports = {
  async index(req, res) {
    const cards = await User.find({ _id: req.userId })
      .select('cards')
      .populate({
        path: 'boards',
        select: 'cards',
        populate: {
          path: 'lists',
          select: 'cards',
          populate: {
            path: 'cards',
          },
        },
      });
    return res.json(cards);
  },
  async store(req, res) {
    // Find List
    const list = await List.findById(req.body._list);
    // Create card
    const card = await Card.create(req.body);
    // Verify if card was created
    if (!card) {
      return res.sendStatus(HTTPCode.OK);
    }
    // Update list
    list.cards.push(card);
    list.save();

    return res.status(HTTPCode.CREATED).json(card);
  },
  async show(req, res) {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    return res.json(card);
  },
  async update(req, res) {
    const cardId = req.params.id;
    // Find Card
    const card = await Card.findById(cardId);

    // Verifica se há lista na requisição e atualiza
    if (req.body._list) {
      const listId = req.body._list;
      // Find List
      const list = await List.findById(listId);
      // Change card's list
      if (!card._list.equals(listId)) {
        const oldList = await List.findById(card._list);
        const newList = await List.findById(listId);

        oldList.cards = oldList.cards.filter(item => !item.equals(cardId));
        oldList.save();

        newList.cards.push(cardId);
        newList.save();
      }
    }

    // Update Card
    const cardUpdated = await Card.findByIdAndUpdate(cardId, req.body, {
      new: true,
    });
    // Check if updated
    if (!cardUpdated) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
    }

    return res.json(cardUpdated);
  },
  async destroy(req, res) {
    // Delelete card
    const card = await Card.findByIdAndRemove(req.params.id);
    if (!card) {
      res.sendStatus(HTTPCode.BAD_REQUEST);
    }
    // Delete from list
    const list = await List.findOne({ cards: card.id });
    list.cards = list.cards.filter(item => !item.equals(req.params.id));
    list.save();

    return res.json(card);
  },
};
