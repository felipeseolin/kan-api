const express = require('express');

const routes = express.Router();

const BoardController = require('./controllers/BoardController');
const ListController = require('./controllers/ListController');

routes.get('/', (req, res) => res.send('Kan API'));

// Board
routes.get('/boards', BoardController.index);
routes.post('/boards', BoardController.store);
routes.get('/boards/:id', BoardController.show);
routes.patch('/boards/:id', BoardController.update);
routes.delete('/boards/:id', BoardController.destroy);
// Lists
routes.get('/lists', ListController.index);
routes.post('/lists', ListController.store);
routes.get('/lists/:id', ListController.show);
routes.patch('/lists/:id', ListController.update);
routes.delete('/lists/:id', ListController.destroy);

module.exports = routes;
