const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const growingUnitsRouter = require('./controllers/growing_units');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const config = require('./utils/config');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const path = require('path');
const currentLocalDateTime = require('./utils/helperFunctions').currentLocalDateTime;

const app = express();

app.use(express.json());
app.use(cors());
app.use(middleware.getTokenFrom);
app.use(express.static('build'));

if (process.env.NODE_ENV !== 'test'){
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
}

const dbUri = config.MONGODB_URI;
logger.info('connecting to MongoDB');

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });
  
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/growing_unit', growingUnitsRouter);

__dirname = path.resolve(path.dirname(''));
app.get('/*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/*
app.get('/', (request, response) => {
  //TODO: change this when you have real 404 page
  response.send(`
  <p>This is probably not what you are looking for. Try</p> 
  <a href="/api/users">/api/users</a> <br/>
  <a href="/api/users/2">/api/users/2</a>
  `);
});*/

app.use(middleware.errorHandler);

module.exports = app;


