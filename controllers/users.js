const usersRouter = require('express').Router();

usersRouter.get('/api/users', (request, response, next) => {
  response.send(persons);
});

usersRouter.get('/api/users/:id', (request, response, next) => {
  const id = request.params.id;
  console.log(id);
  const user = persons.find(user => Number(user.id) === Number(id));
  if (user) {
    response.send(user);
  } else {
    response.status(400);
  }
});