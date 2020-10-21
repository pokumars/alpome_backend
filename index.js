const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');


const app = express();
app.use(cors());

const persons = require('./scratchpad').persons;
app.get('/api', (request, response, next) => {
  response.send(`
  <p>This is probably not what you are looking for. Try</p> 
  <a href="/api/users">/api/users</a> <br/>
  <a href="/api/users/2">/api/users/2</a>
  `);
});

app.get('/api/users', (request, response, next) => {
  response.send(persons);
});

app.get('/api/users/:id', (request, response, next) => {
  const id = request.params.id;
  console.log(id);
  const user = persons.find(user => Number(user.id) === Number(id));
  response.send(user);
});

const PORT = 3002;
app.listen(PORT,() => {
  logger.info(`server is running on port ${PORT}`);
});

//we will need to serve users
//we will need to serve growing units/plants
  //images, the users who have access
