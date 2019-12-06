const routes = require('express').Router();
const cache = require('./cache');
const BoardController = require('./controllers/BoardController');
const ListController = require('./controllers/ListController');
const CardController = require('./controllers/CardController');

routes.get('/', (req, res) => res.send('Kan API'));

// Board
routes.get('/boards', cache.route('boards'), BoardController.index);
routes.post('/boards', BoardController.store);
routes.get('/boards/:id', BoardController.show);
routes.patch('/boards/:id', BoardController.update);
routes.delete('/boards/:id', BoardController.destroy);
routes.get('/boards/all/:id', BoardController.all);
// Lists
routes.get('/lists', ListController.index);
routes.post('/lists', ListController.store);
routes.get('/lists/:id', ListController.show);
routes.patch('/lists/:id', ListController.update);
routes.delete('/lists/:id', ListController.destroy);
// Cards
routes.get('/cards', CardController.index);
routes.post('/cards', CardController.store);
routes.get('/cards/:id', CardController.show);
routes.patch('/cards/:id', CardController.update);
routes.delete('/cards/:id', CardController.destroy);

module.exports = routes;
