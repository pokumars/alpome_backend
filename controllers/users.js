const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../utils/config');

const populatedGrowingUnitFields = {nickname: 1, supragarden: 1,location: 1, unit_id: 1};
// /api/users/ Get all users
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('own_units', populatedGrowingUnitFields) ;
    console.log('GET /api/users');
    response.send(users);
  } catch (error) {
    next(error);
  }
});

// /api/users/:id Get a single user by id
usersRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;
  try {      
    const user = await User.findById(id).populate('own_units', populatedGrowingUnitFields);
    console.log(user);

    if (user) {
      response.send(user.toJSON());
    } else {
      response.status(400).json({
        error: 'user does not exist or not found'
      });
    }
  } catch (error) {
    next(error);
  }
});

// /api/users/:id delete a single user
usersRouter.delete('/:id',async (request, response, next) => {
  //TODO: confirm user  has token before they can delete themselves.
  //TODO: confirm that user can only delete they themselves
  //TODO: delete user means delete all their uploaded units as well as their images

  const id = request.params.id;
  try {


    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser);
    
    response.send(`user has been deleted ${deletedUser}`);
  } catch (error) {
    next(error);
  }
});

// /api/users add a user
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
      own_units: body.own_units|| [],
      units_with_access:body.units_with_access || []
    };
    console.log('userObj to save ----', userObj);
    const user = new User(userObj);

    const savedUser = await user.save();
  
    response.json(savedUser.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;

