const growingUnitsRouter = require('express').Router();
const logger = require('../utils/logger');
let persons = require('../scratchpad').persons;
const GrowingUnit = require('../models/growing_units');

// endpoint /
growingUnitsRouter.get('/', async (request, response, next) => {

  try {
    const gUnits = await GrowingUnit
      .find({});

    response.json(gUnits);
    //.populate('user');
  }catch(exception){
    next(exception);
  }
});

// endpoint /api/users/:id
growingUnitsRouter.get('/:id', async (request, response, next) => {
  console.log('GET /api/growing_unit/:id');

  console.log(request.params.id);
  //const user = persons.find(user => Number(user.id) === Number(id));
  try {
    const growingUnit = await GrowingUnit
      .findById(request.params.id);

    if (growingUnit) {
      response.json(growingUnit);
    } else {
      response.status(404).json({
        error: 'growingUnit does not exist'
      });
      next();
    }
  } catch (error) {
    next(error);
    response.status(404).end();
  }
  

});

// endpoint /api/users/:id
growingUnitsRouter.delete('/:id',(request, response) => {
  const id = request.params.id;
  try {
    persons = persons.filter(obj => Number(obj.id) !== Number(id));
    //logger.info(`length of persons is now ${persons.length}`);
    response.send(`length of persons is now ${persons.length}`);
  } catch (error) {
    logger.error(error);
  }
});

// endpoint /api/users
growingUnitsRouter.post('/api/growing_unit', (request, response) => {
  const body = request.body;
  if(!body.name, !body.username, !body.email) {
    response.status(400).json({
      error: 'some information were missing in the request'
    });
  }

  const growingUnit = body;
  console.log('GET /api/growing_unit', growingUnit);

  //persons = [...persons, userObj];
  response.send(persons);
});

module.exports = growingUnitsRouter;
