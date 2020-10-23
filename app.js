const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const logger = require('./utils/logger');
const currentLocalDateTime = require('./utils/helperFunctions').currentLocalDateTime;

let persons = require('./scratchpad').persons;
const genRandom = require('./scratchpad').createRandomNum;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', usersRouter);

//Morgan logs any incoming request. The array below is  how we want it to log the details
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

//const persons = require('./scratchpad').persons;
app.get('/api', (request, response) => {
  //TODO: change this when you have real data
  response.send(`
  <p>This is probably not what you are looking for. Try</p> 
  <a href="/api/users">/api/users</a> <br/>
  <a href="/api/users/2">/api/users/2</a>
  `);
});



module.exports = app;


