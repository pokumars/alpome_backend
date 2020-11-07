const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('growing units are returned as json', async () => {
  await api
    .get('/api/growing_unit')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

/*
test('', async () => {
  const response  = await api.get('/api/growing_unit')
  expect()
});
*/

test('should have two growing units', async () => {
  const response  = await api.get('/api/growing_unit');

  expect(response.body.length).toBe(2);
});

test('sfirst growing unit should have nickname - no image tree 1', async () => {
  const response  = await api.get('/api/growing_unit');

  expect(response.body[0].nickname).toBe('no image tree 1');
});


afterAll(() => {
  mongoose.connection.close();
});