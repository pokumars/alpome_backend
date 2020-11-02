const usersRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../utils/config');

// endpoint /
usersRouter.get('/', (request, response) => {
  console.log('GET /api/users');
  response.send(persons);
});

// endpoint /api/users/:id
usersRouter.get('/:id', (request, response) => {
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

// endpoint /api/users/:id
usersRouter.delete('/:id',async (request, response) => {
  const id = request.params.id;
  try {
    persons = persons.filter(obj => Number(obj.id) !== Number(id));
    logger.info(`length of persons is now ${persons.length}`);
    response.send(`length of persons is now ${persons.length}`);
  } catch (error) {
    logger.error(error);
  }
});

// endpoint /api/users
usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    if(!body.username, !body.email, !body.password) {
      return response.status(400).json({
        error: `Some information is missing.
       Either username, or email or password`
      });
    }
    else if (body.password.length < 4){
      return response.status(400).send({ error: 'password must be longer than 3 characters' });
    }
    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

    const userObj = {
      email: body.email,
      username: body.username,
      passwordHash: passwordHash, //TODO: change this to actual passwordHash
      own_units: [],
      units_with_access:[]
    };
    console.log('userObj to save ----', userObj);
    const user = new User(userObj);

    const savedUser = await user.save();
  
    response.json(savedUser.toJSON());
  } catch (exception) {
    logger.error(exception);
    response.status(400).json({
      error: `There was an error when adding a new user.
      
       ${exception}`
    });
    next(exception);
  }
});

module.exports = usersRouter;
