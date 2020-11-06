//TODO: a user logging in
// give token that they use for the session

const loginRouter = require('express').Router();
const bcrypt= require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    //find that user in db
    const user = await User.findOne({ username: body.username });
    if(!user || user === null){
      return response.status(406).json({
        error: `There is no such user.
    Try creating an account`});
    }

    const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash);
    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'invalid username or password'
      });
    }
    console.log(`${user.username} put in the correct password`);

    response
      .status(200)
      .send(user.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;