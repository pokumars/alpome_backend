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

//get single growing unit by id
growingUnitsRouter.get('/:id', async (request, response, next) => {

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
growingUnitsRouter.delete('/:id',async (request, response, next) => {
  try {
    /*Don't just delete because you got a request to delete. Some checks need to be
    done. The user submitting the delete request has to for example be the owner of
   the growing unit before they can delete a unit. They have to be logged in and 
    have a user token that says they are logged in etc. */
    
    //TODO: add user token mechanism
    //TODO: check if delete request is coming from right user. Check fullstackOpen\p4BlogList\controllers\blogs.js for example.
    
    const unitToDelete = await GrowingUnit
      .findByIdAndDelete(request.params.id);
    if(unitToDelete) {
      response.status(204);
    } else {
      response.status(204).json({
        error: 'growingUnit does not exist'
      });
    }

  } catch (error) {
    logger.error(error);
    next(error);
  }
});

// endpoint /api/users
growingUnitsRouter.put('/:id', async (request, response, next) => {
  /*Don't just update because you got a request to update. Some checks need to be
    done. The user submitting the update request has to for example be the owner of
   the growing unit before they can update a unit. They have to be logged in and 
    have a user token that says they are logged in etc. */

  try {
    const replacement = request.body;
    const updatedUnit = await GrowingUnit
      .findByIdAndUpdate(request.params.id, replacement, { new: true });

    if (updatedUnit) {
      console.log(updatedUnit);
      response.json(updatedUnit);
    } else {
      logger.error('some error updating growing unit of id ', request.paramsms.id);
      response.json({
        error: 'Could not find unit to update'
      });
    }
  } catch (error) {
    next(error);
    response.status(400);
  }
});

// endpoint /api/users
growingUnitsRouter.post('/', (request, response, next) => {
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
