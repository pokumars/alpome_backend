const express = require('express');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const logger = require('./utils/logger');

let persons = require('./scratchpad').persons;
const genRandom = require('./scratchpad').createRandomNum

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', usersRouter);

//const persons = require('./scratchpad').persons;
app.get('/api', (request, response, next) => {
  response.send(`
  <p>This is probably not what you are looking for. Try</p> 
  <a href="/api/users">/api/users</a> <br/>
  <a href="/api/users/2">/api/users/2</a>
  `);
});
app.get('/api/users', (request, response) => {
  console.log('GET /api/users')
  response.send(persons);
});

app.get('/api/users/:id', (request, response) => {
  console.log('GET /api/users/:id');
  const id = request.params.id;
  console.log(id);
  const user = persons.find(user => Number(user.id) === Number(id));
  if (user) {
    response.send(user);
  } else {
    response.status(400);
  }
});

app.delete('/api/users/:id',(request, response) => {
  const id = request.params.id;
  try {
    persons = persons.filter(obj => Number(obj.id) !== Number(id));
    logger.info(`length of persons is now ${persons.length}`);
    response.send(`length of persons is now ${persons.length}`);
  } catch (error) {
    logger.error(error);
  }
});

app.post('/api/users', (request, response) => {
  const body = request.body;
  const userObj = {id: genRandom(1, 100000), ...body};
  console.log('GET /api/users', userObj);

  persons = [...persons, userObj];
  response.send(persons);
});


const PORT = 3002;
app.listen(PORT,() => {
  logger.info(`server is running on port ${PORT}`);
});

//we will need to serve users
//we will need to serve growing units/plants
  //images, the users who have access
