const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./testHelper');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');
//delete all users except await User.deleteMany({ _id: { $ne: '5fa695a9b3f5a101307ebecf' }});


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
    await User.deleteMany({ _id: { $ne: '5fa695a9b3f5a101307ebecf' }});

  
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
      //.attach('image', helper.imageFile);

    await api.post('/api/growing_unit')
      .field('common_names', 'tree 2')
      .field('nickname', 'tree nickname2')
      .field('location', 'Grandma\'s place f')
      .field('shared_access', '[]')
      .field('supragarden', 'false')
      .field('last_watered', 'null')
      .field('watering_frequency', '432000000')
      .field('data_source', 'null')
      .field('stream_url', 'someshite.smth')
      .field('owner', '5fa695a9b3f5a101307ebecf');
      
      
    /*let growingUnitObject = new GrowingUnit(initialGrowingUnits[1]);
    await growingUnitObject.save();*/
  });

  test('growing units are returned as json', async () => {
    await api
      .get('/api/growing_unit')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });


  test.skip('should have as many growing units as the initialGrowingUnits', async () => {
    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(helper.initialGrowingUnits.length);
  });

  test.skip('first growing unit should have specific nicknames', async () => {
    const response  = await api.get('/api/growing_unit');
    const nickNames = response.body.map(g => g.nickname);

    expect(nickNames).toContain('tree nickname1');
    expect(nickNames).toContain('tree nickname2');
  });

  test.skip('upload unit with a non-existent user - should not add unit, not add image either should return with certain code and certain error message ', async () => {
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
      .attach('image',helper.imagePath)
      .expect(400);

      
    //Todo: check that there is only one image in the bucket?? or not since that is our test bucket for all projects

    expect(postResponse.body.error).toContain('User does not exist. So Could not save the growing unit. Check user id (aka owner in request body)');

    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(helper.initialGrowingUnits.length);

  });
  
  test.skip('update growing unit should return the updated object', async () => {
    //find a unit by id
    const unitToTestId  = await api.get('/api/growing_unit');
    //console.log('-------unitToTestId.body', unitToTestId.body);
    //console.log( '-------unit to test id', unitToTestId.body[0].unit_id );
    const id = unitToTestId.body[0].unit_id;
    
    //update two or 3 factors
    await api.put(`/api/growing_unit/${id}`)
      .set('Content-Type', 'application/json')
      .send(`{"nickname":"${helper.anUpdatedUnit.nickname}", "location":"${helper.anUpdatedUnit.location}"}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    

    //check they are updated
    const theUpdatedObjectInDb = await GrowingUnit.findById(id);
    //console.log('theUpdatedObjectInDb',theUpdatedObjectInDb);
    //console.log('theUpdatedObjectInDb.location', theUpdatedObjectInDb.location);

    expect(theUpdatedObjectInDb.location).toBe(helper.anUpdatedUnit.location);
    expect(theUpdatedObjectInDb.nickname).toBe(helper.anUpdatedUnit.nickname);
  });
  
  test('update a growing unit should work with a user token', async () => {
    //create user
    const newUser = await api.post('/api/users')
      .send(helper.testUserForGrowingUnitTests);
    //console.log('-----newUser-------------',newUser.body);

    //post a unit for that user
    //console.log('-----newUser.body.user_id------------',newUser.body.user_id);
    const unitToPost = {
      'nickname': 'did token succeed?',
      'common_names': [
        'did token succeed?'
      ],
      'shared_access': [],
      'location': 'did token succeed?',
      'supragarden': false,
      'last_watered': null,
      'watering_frequency': 432000000,
      'data_source': null,
      'stream_url': 'didTokenSucceed.smth',
      'owner': newUser.body.user_id
    };
    const postedUnit = await api.post('/api/growing_unit').send(unitToPost);
    const postedUnitId = postedUnit.body.unit_id;


    //login and get token
    const user = await api.post('/api/login')
      .send({ 'username': helper.testUserForGrowingUnitTests.username , 'password': helper.testUserForGrowingUnitTests.password })
      .expect(200);
    const token = user.body.token;
    //console.log('-----login response-------------',user);
    //console.log('-----user.token being sent-------------',user.body.token);


    //update two or 3 factors
    const stringThatFieldsShouldBecome = 'Token thing succeeded';
    await api.put(`/api/growing_unit/${postedUnitId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send(`{"nickname":"${stringThatFieldsShouldBecome}", "location":"${stringThatFieldsShouldBecome}"}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //check they are updated
    const theUpdatedObjectInDb = await GrowingUnit.findById(postedUnitId);
    //console.log('-----theUpdatedObjectInDb-------------',theUpdatedObjectInDb);

    expect(theUpdatedObjectInDb.location).toBe(stringThatFieldsShouldBecome);
    expect(theUpdatedObjectInDb.nickname).toBe(stringThatFieldsShouldBecome);
  });

  test('update a growing unit should not work without a user token', async () => {
    
    //login and get token
    const user = await api.post('/api/login')
      .send({ 'username': helper.testUserForGrowingUnitTests.username , 'password': helper.testUserForGrowingUnitTests.password })
      .expect(200);
    const token = user.body.token;

    //that user will only have one unit at this point
    const postedUnitId = user.body.user.own_units[0];

    //update two or 3 factors
    const expectedString = 'Token thing succeeded';//in the previous test the test it was updated to 'Token thing succeeded'

    //update two or 3 factors
    const auba = 'Aubameyang', kroosHead = 'Toni Kroos head';
    await api.put(`/api/growing_unit/${postedUnitId}`)
      .set('Content-Type', 'application/json')
      //.set('Authorization', `bearer ${token}`)
      .send(`{"nickname":"${auba}", "location":"${kroosHead}"}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body.error).toBe('invalid token');
      });

    //check they are updated
    const theUpdatedObjectInDb = await GrowingUnit.findById(postedUnitId);
    
    expect(theUpdatedObjectInDb.location).toBe(expectedString);
    expect(theUpdatedObjectInDb.nickname).toBe(expectedString);
    expect(theUpdatedObjectInDb.location).not.toBe(auba);
    expect(theUpdatedObjectInDb.nickname).not.toBe(kroosHead);
  });

});

afterAll(() => {
  mongoose.connection.close();
});

//GROWING UNIT TESTS

//TEST: update growing unit image should come with the updated object with one more image
//TEST: delete a growing unit should not work without a user token
//TEST: update a growing unit should not work without a user token
//TEST: post a growing unit should not work without a user token
//TEST: delete image of a growing unit - should return growing unit without that image; + image deleted from S3
//TEST: delete growing unit - unit no longer in db, unit images no longer in S3
//TEST: add new image to growing unit- return growing unit with 1 more image and image in S3

//TEST:


//USER TESTS
//TEST: Add user - should return user of the same username and email and also a user id.
//TEST:login should grant user token
//TEST:login should grant user token and userObj. userObj contains- array of their units by id, array of units they have access to by id, email, username, userId
//TEST:The logged-in user now has all their units and can fetch by id. that fetch should give all details about all units
//TEST: change password - should have changed password. use new password to login and see if that it grants user token

//TEST: delete a user - user should no longer exist
//TEST: delete a user - user should no longer exist nor their growing units, nor their growing unit's images
//TEST: //TODO: delete growing unit from user when it is deleted  


