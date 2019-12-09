const mongoose = require('mongoose');

const HTTPCode = require('../utils/HTTPCode');
const CardInit = require('../models/Card');
const ListInit = require('../models/List');
const UserInit = require('../models/User');

const Card = mongoose.model('Card');
const List = mongoose.model('List');
const User = mongoose.model('User');

function validate(name, description, list) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Um nome deve ser dado ao cartão.'];
  }
  if (name && name.length > 100) {
    errors = [...errors, 'O nome deve ter ao máximo 100 caracteres.'];
  }
  if (name && name.length < 5) {
    errors = [...errors, 'O nome deve ter ao mínimo 5 caracteres.'];
  }
  if (description && description.length > 250) {
    errors = [...errors, 'A descrição deve ter ao máximo 250 caracteres.'];
  }
  if (!list) {
    errors = [...errors, 'O cartão deve pertencer a uma lista'];
  }

  return errors;
}

function validateAndRedirect(req, res) {
  const { name, description, _list } = req.body;
  const error = validate(name, description, _list);
  if (error.length > 0) {
    res.status(HTTPCode.BAD_REQUEST).send({ error });
  }
}

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
    const { name, description, _list } = req.body;
    // Find List
    const list = await List.findById(_list);
    if (!list) {
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ error: 'Lista não encontrada' });
    }
    // Validate Card
    const error = validate(name, description, _list);
    if (error.length > 0) {
      return res.status(HTTPCode.BAD_REQUEST).send({ error });
    }
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
    const { name, description, _list } = req.body;
    const cardId = req.params.id;
    // Find Card
    const card = await Card.findById(cardId);
    if (!card) {
      return res
        .status(HTTPCode.NOT_FOUND)
        .send({ error: ['Cartão não encontrado'] });
    }
    // Find List
    const list = await List.findById(_list);
    if (!list) {
      return res
        .status(HTTPCode.NOT_FOUND)
        .send({ error: ['Lista não encontrada'] });
    }
    // Validate Card Update Request
    const error = validate(name, description, _list);
    if (error.length > 0) {
      return res.status(HTTPCode.BAD_REQUEST).send({ error });
    }
    // Verifica se há lista na requisição e atualiza
    if (_list) {
      // Change card's list
      if (!card._list.equals(_list)) {
        const oldList = await List.findById(card._list);
        const newList = await List.findById(_list);

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
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ error: 'O cartão não foi atualizado' });
    }

    return res.status(HTTPCode.OK).json(cardUpdated);
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
