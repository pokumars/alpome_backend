const usersRouter = require('express').Router();
const logger = require('../utils/logger');
const genRandom = require('../scratchpad').createRandomNum;
let persons = require('../scratchpad').persons;

// endpoint
usersRouter.get('/', (request, response) => {
  console.log('GET /api/users');
  response.send(persons);
});

// endpoint /api/users/:id
usersRouter.get('/api/users/:id', (request, response) => {
  console.log('GET /api/users/:id');
  const id = request.params.id;
  console.log(id);
  const user = persons.find(user => Number(user.id) === Number(id));
  if (user) {
    response.send(user);
  } else {
    response.status(400).json({
      error: 'user does not exist'
    });
  }
});

// endpoint
usersRouter.delete('/api/users/:id',(request, response) => {
  const id = request.params.id;
  try {
    persons = persons.filter(obj => Number(obj.id) !== Number(id));
    logger.info(`length of persons is now ${persons.length}`);
    response.send(`length of persons is now ${persons.length}`);
  } catch (error) {
    logger.error(error);
  }
});

// endpoint
usersRouter.post('/api/users', (request, response) => {
  const body = request.body;
  if(!body.name, !body.username, !body.email) {
    response.status(400).json({
      error: 'some information were missing in the request'
    });
  }
  const userObj = {id: genRandom(1, 100000), ...body};
  console.log('GET /api/users', userObj);

  persons = [...persons, userObj];
  response.send(persons);
});

module.exports = usersRouter;
