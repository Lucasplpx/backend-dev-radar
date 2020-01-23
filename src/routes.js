const { Router } = require('express');
const routes = Router();

const DevController = require('./controllers/dev');
const SearchController = require('./controllers/search');

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;