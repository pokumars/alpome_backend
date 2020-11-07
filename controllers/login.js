//TODO: a user logging in
// give token that they use for the session
const { SECRET } = require('../utils/config');
const loginRouter = require('express').Router();
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

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
    const userForToken = {
      username: user.username,
      id: user._id
    };
    const token = jwt.sign(userForToken, SECRET);
    logger.info(`${user.username} put in the correct password`);

    response
      .status(200)
      .send({token, user: user.toJSON()});
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;