const routes = require('express').Router();
const cache = require('./middlewares/cache');
const constants = require('./cache/constants');
const uncache = require('./middlewares/uncache');
const auth = require('./middlewares/auth');

const BoardController = require('./controllers/BoardController');
const ListController = require('./controllers/ListController');
const CardController = require('./controllers/CardController');
const UserController = require('./controllers/UserController');

routes.get('/', (req, res) => res.send('Kan API'));

// User
routes.post('/register', UserController.register);
routes.post('/authenticate', UserController.authenticate);
// Board
routes.get('/boards', [auth, cache(constants.BOARDS)], BoardController.index);
routes.post(
  '/boards',
  [auth, uncache(constants.BOARDS_ALLL_BOARDS)],
  BoardController.store
);
routes.get(
  '/boards/:id',
  [auth, uncache(constants.BOARDS_ALLL_BOARDS)],
  BoardController.show
);
routes.patch(
  '/boards/:id',
  [auth, uncache(constants.BOARDS_ALLL_BOARDS)],
  BoardController.update
);
routes.delete(
  '/boards/:id',
  [auth, uncache(constants.BOARDS_ALLL_BOARDS)],
  BoardController.destroy
);
routes.get(
  '/boards/all/:id',
  [auth, cache(constants.ALLL_BOARDS)],
  BoardController.all
);
// Lists
routes.get(
  '/lists',
  [auth, cache(constants.LISTS)],
  ListController.index
);
routes.post(
  '/lists',
  [auth, uncache(constants.LISTS_BOARDS)],
  ListController.store
);
routes.get(
  '/lists/:id',
  [auth, uncache(constants.LISTS_BOARDS)],
  ListController.show
);
routes.patch(
  '/lists/:id',
  [auth, uncache(constants.LISTS_BOARDS)],
  ListController.update
);
routes.delete(
  '/lists/:id',
  [auth, uncache(constants.LISTS_BOARDS)],
  ListController.destroy
);
routes.get(
  '/boards/:id/lists',
  [auth, cache(constants.LISTS_FROM_BOARD)],
  ListController.listFromBoard
);
// Cards
routes.get(
  '/cards',
  [auth, cache(constants.CARDS)],
  CardController.index
);
routes.post(
  '/cards',
  [auth, uncache(constants.CARDS_LISTS_BOARDS)],
  CardController.store
);
routes.get(
  '/cards/:id',
  [auth, uncache(constants.CARDS_LISTS_BOARDS)],
  CardController.show
);
routes.patch(
  '/cards/:id',
  [auth, uncache(constants.CARDS_LISTS_BOARDS)],
  CardController.update
);
routes.delete(
  '/cards/:id',
  [auth, uncache(constants.CARDS_LISTS_BOARDS)],
  CardController.destroy
);
// Clean Cache
routes.get('/cleanCache', uncache(['*']), (req, res) =>
  res.send('Cleaned all cache')
);

module.exports = routes;
