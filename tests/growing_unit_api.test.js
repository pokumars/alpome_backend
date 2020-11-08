const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { initialGrowingUnits, imageFile, imagePath } = require('./testHelper');
const GrowingUnit = require('../models/growing_unit');



const api = supertest(app);

/*
test('', async () => {
  const response  = await api.get('/api/growing_unit')
  expect()
});
*/

describe('Tests that dont need a beforeEach', () => {
  beforeAll(async () => {
    await GrowingUnit.deleteMany({});
  
    /*let growingUnitObject = new GrowingUnit(initialGrowingUnits[0]);
    await growingUnitObject.save();*/
  
    
    await api.post('/api/growing_unit')
      .field('common_names', 'image tree 1')
      .field('nickname', 'tree nickname1')
      .field('location', 'Grandma\'s place3')
      .field('shared_access', '[]')
      .field('supragarden', 'false')
      .field('last_watered', 'null')
      .field('watering_frequency', '432000000')
      .field('data_source', 'null')
      .field('stream_url', 'someshite.smth')
      .field('owner', '5fa695a9b3f5a101307ebecf')
      .attach('image',imagePath);
      
      
  
    let growingUnitObject = new GrowingUnit(initialGrowingUnits[1]);
    await growingUnitObject.save();
  });

  test('growing units are returned as json', async () => {
    await api
      .get('/api/growing_unit')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should have as many growing units as the initialGrowingUnits', async () => {
    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(initialGrowingUnits.length);
  });

  test('first growing unit should have nickname - no image tree 1', async () => {
    const response  = await api.get('/api/growing_unit');
    const nickNames = response.body.map(g => g.nickname);

    expect(nickNames).toContain('tree nickname1');
    expect(nickNames).toContain('no image tree 1');
  });
});

afterAll(() => {
  mongoose.connection.close();
});