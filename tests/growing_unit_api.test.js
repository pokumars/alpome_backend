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
    //TODO: delete growing unit images too when u delete a growing unit 
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

  test('upload unit with a non-existent user - should not add unit, not add image either should return with certain code and certain error message ', async () => {
    const postResponse = await api.post('/api/growing_unit')
      .field('common_names', 'non existent user unit')
      .field('nickname', 'tree nonExUsr')
      .field('location', 'in the ether')
      .field('shared_access', '[]')
      .field('supragarden', 'false')
      .field('last_watered', 'null')
      .field('watering_frequency', '432000000')
      .field('data_source', 'null')
      .field('stream_url', 'someshite.smth')
      .field('owner', '5fa695a9b3f5a101307ebe4a')
      .attach('image',imagePath)
      .expect(400);

      
      //Todo: check that there is only one image in the bucket?? or not since that is our test bucket for all projects

    expect(postResponse.body.error).toContain('User does not exist. So Could not save the growing unit. Check user id (aka owner in request body)');

    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(initialGrowingUnits.length);

  });
  
});

afterAll(() => {
  mongoose.connection.close();
});

//GROWING UNIT TESTS
//TEST: upload unit with a non-existent user should not add unit, not add image either should return with certain code and certain error message
//TEST: update growing unit should come with the update
//TEST: delete a growing unit should not work without a user token
//TEST: delete image of a growing unit - should return growing unit without that image; + image deleted from S3
//TEST: delete growing unit - unit no longer in db, unit images no longer in S3
//TEST: add new image to growing unit- return growing unit with 1 more image and image in S3

//TEST:


//USER TESTS
//TEST: Add user - should return user of the same username and email and also a user id.
//TEST: change password - should have changed password. use new password to login and see if that it grants user token
//TEST:login should grant user token
//TEST: delete a user - user should no longer exist
//TEST: delete a user - user should no longer exist nor their growing units, nor their growing unit's images
//TEST:
