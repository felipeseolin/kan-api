const routes = require('express').Router();
const cache = require('./cache');
const constants = require('./cache/constants');
const uncache = require('./middlewares/uncache');
const BoardController = require('./controllers/BoardController');
const ListController = require('./controllers/ListController');
const CardController = require('./controllers/CardController');
const UserController = require('./controllers/UserController');

routes.get('/', (req, res) => res.send('Kan API'));

// User
routes.post('/register', UserController.register);
// Board
routes.get('/boards', cache.route(constants.BOARDS), BoardController.index);
routes.post('/boards', uncache(constants.BOARDS_ALLL_BOARDS), BoardController.store);
routes.get('/boards/:id', uncache(constants.BOARDS_ALLL_BOARDS), BoardController.show);
routes.patch('/boards/:id', uncache(constants.BOARDS_ALLL_BOARDS), BoardController.update);
routes.delete('/boards/:id', uncache(constants.BOARDS_ALLL_BOARDS), BoardController.destroy);
routes.get('/boards/all/:id', cache.route(constants.ALLL_BOARDS), BoardController.all);
// Lists
routes.get('/lists', cache.route(constants.LISTS), ListController.index);
routes.post('/lists', uncache(constants.LISTS_BOARDS), ListController.store);
routes.get('/lists/:id', uncache(constants.LISTS_BOARDS), ListController.show);
routes.patch('/lists/:id', uncache(constants.LISTS_BOARDS), ListController.update);
routes.delete('/lists/:id', uncache(constants.LISTS_BOARDS), ListController.destroy);
// Cards
routes.get('/cards', cache.route(constants.CARDS), CardController.index);
routes.post('/cards', uncache(constants.CARDS_LISTS_BOARDS), CardController.store);
routes.get('/cards/:id', uncache(constants.CARDS_LISTS_BOARDS), CardController.show);
routes.patch('/cards/:id', uncache(constants.CARDS_LISTS_BOARDS), CardController.update);
routes.delete('/cards/:id', uncache(constants.CARDS_LISTS_BOARDS), CardController.destroy);
// Clean Cache
routes.get('/cleanCache', uncache(['*']), (req, res) => res.send('Cleaned all cache'));

module.exports = routes;
