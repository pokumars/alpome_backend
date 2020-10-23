//Get back to controllers

const usersRouter = require('express').Router();
const persons = require('../scratchpad').persons;

usersRouter.get('/api/users', (request, response) => {
  console.log('GET /api/users')
  response.send(persons);
});

usersRouter.get('/api/users/:id', (request, response) => {
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
/*
usersRouter.delete('/api/users/:id',(request, response) => {
  const
})
*/
module.exports = usersRouter;
