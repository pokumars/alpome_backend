const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const growingUnitsRouter = require('./controllers/growing_units');
const logger = require('./utils/logger');
const config = require('./utils/config');
const mongoose = require('mongoose');
const currentLocalDateTime = require('./utils/helperFunctions').currentLocalDateTime;

const app = express();

app.use(express.json());
app.use(cors());
//morgan logs any incoming request. The array below is  how we want it to log the details
app.use(morgan((tokens, req, res) => {
  return[
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    currentLocalDateTime(),
  ].join(' ');
}));

const dbUri = config.MONGO_DB_TRIAL_URI;
logger.info('connecting to MongoDB');

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use('/api/users', usersRouter);
app.use('/api/growing_unit', growingUnitsRouter);

app.get('/', (request, response) => {
  //TODO: change this when you have real 404 page
  response.send(`
  <p>This is probably not what you are looking for. Try</p> 
  <a href="/api/users">/api/users</a> <br/>
  <a href="/api/users/2">/api/users/2</a>
  `);
});


const errorHandler= (error, request, response, next) => {
  logger.error(error);

  if(error.name==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({ error: 'malformatted id' });
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

module.exports = app;


