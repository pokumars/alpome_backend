const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./testHelper');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');
//delete all users except await User.deleteMany({ _id: { $ne: '5fa695a9b3f5a101307ebecf' }});


const api = supertest(app);

//login and get token
const loginAndGetToken = async () => {
  const user = await api.post('/api/login')
    .send({ 'username': helper.testUserForGrowingUnitTests.username , 'password': helper.testUserForGrowingUnitTests.password })
    .expect(200);
  const token = user.body.token;
  return {user, token};
};

const loginMasterAndGetToken = async () => {
  const user = await api.post('/api/login')
    .send({ 'username': 'testUser1' , 'password':'jonSnow' })
    .expect(200);
  const token = user.body.token;
  return {user, token};
};
/*
test('', async () => {
  const response  = await api.get('/api/growing_unit')
  expect()
});
*/
describe('Tests that dont need a beforeEach', () => {
  beforeAll(async () => {
    /*const masterUnit = await User.findById('5fa695a9b3f5a101307ebecf');
    console.log('masterUnit.own_units',masterUnit.own_units);
    //TODO: delete growing unit images too when u delete a growing unit 
    await GrowingUnit.deleteMany({ _id: { $ne: {$in:masterUnit.own_units.map(id => ObjectId(id.toString())) }}});*/

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
      .field('owner', '5fa695a9b3f5a101307ebecf');
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


  test('should have as many growing units as the initialGrowingUnits', async () => {
    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(helper.initialGrowingUnits.length);
  });

  test('first growing unit should have specific nicknames', async () => {
    const response  = await api.get('/api/growing_unit');
    const nickNames = response.body.map(g => g.nickname);

    expect(nickNames).toContain('tree nickname1');
    expect(nickNames).toContain('tree nickname2');
  });

  test('upload unit with a non-existent user - should not add unit should return with certain code and certain error message ', async () => {
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
    const expectedErrorMessage = 'User does not exist. So Could not save the growing unit. Check user id (aka owner in request body)';
    expect(postResponse.body.error).toContain(expectedErrorMessage);

    const response  = await api.get('/api/growing_unit');

    expect(response.body.length).toBe(helper.initialGrowingUnits.length);

  });
  
  test('update growing unit should return the updated object', async () => {
    //login and getToken
    const loginReturnObj = await loginMasterAndGetToken();

    //find a unit by id
    const unitToTestId = await api.get('/api/growing_unit');
    //console.log('-------unitToTestId.body', unitToTestId.body);
    //console.log( '-------unit to test id', unitToTestId.body[0].unit_id );
    const id = unitToTestId.body[0].unit_id;
    
    //update two or 3 factors
    await api.put(`/api/growing_unit/${id}`)
      .set('Content-Type', 'application/json')
      .send(`{"nickname":"${helper.anUpdatedUnit.nickname}", "location":"${helper.anUpdatedUnit.location}"}`)
      .set('Authorization', `bearer ${loginReturnObj.token}`)
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

    //post a unit for that user
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
    const loginReturnObj = await loginAndGetToken();

    //update two or 3 factors
    const stringThatFieldsShouldBecome = 'Token thing succeeded';
    await api.put(`/api/growing_unit/${postedUnitId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${loginReturnObj.token}`)
      .send(`{"nickname":"${stringThatFieldsShouldBecome}", "location":"${stringThatFieldsShouldBecome}"}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //check they are updated
    const theUpdatedObjectInDb = await GrowingUnit.findById(postedUnitId);

    expect(theUpdatedObjectInDb.location).toBe(stringThatFieldsShouldBecome);
    expect(theUpdatedObjectInDb.nickname).toBe(stringThatFieldsShouldBecome);
  });

  test('update a growing unit should not work without a user token', async () => {
    const loginReturnObj = await loginAndGetToken();
    
    //that user will only have one unit at this point
    const postedUnitId = loginReturnObj.user.body.user.own_units[0];

    //update two or 3 factors
    const expectedString = 'Token thing succeeded';//in the previous test the test it was updated to 'Token thing succeeded'

    const auba = 'Aubameyang', kroosHead = 'Toni Kroos head';
    await api.put(`/api/growing_unit/${postedUnitId}`)
      .set('Content-Type', 'application/json')
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
  
  test('delete a growing unit should not work without a user token', async () => {
    const loginReturnObj = await loginAndGetToken();
    const userId = loginReturnObj.user.body.user.user_id;
    
    //that user will only have one unit at this point
    const postedUnitId = loginReturnObj.user.body.user.own_units[0];
    await api.delete(`/api/growing_unit/${postedUnitId}`).expect(401);

    const allUnits = await GrowingUnit.find({});
    const usersUnitsInDb = allUnits.filter(u => u.owner.toString() === userId.toString());
    expect(usersUnitsInDb.length).toBe(1);
  });

  test('delete a growing unit should not work with another user\'s token', async () => {
    const loginReturnObj = await loginAndGetToken();
    const userId = loginReturnObj.user.body.user.user_id;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMSIsImlkIjoiNWZhNjk1YTliM2Y1YTEwMTMwN2ViZWNmIiwiaWF0IjoxNjA1MzU2MzY0fQ.id7Wbx0cSDMLbANRFE8RqJpXiPvmAP8ViN54Yyp9AWM';
    
    //that user will only have one unit at this point
    const postedUnitId = loginReturnObj.user.body.user.own_units[0];
    await api.delete(`/api/growing_unit/${postedUnitId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401)
      .then(response => {
        expect(response.body.error).toBe('You dont have the right permissions to update this unit');
      });

    const allUnits = await GrowingUnit.find({});
    const usersUnitsInDb = allUnits.filter(u => u.owner.toString() === userId.toString());
    expect(usersUnitsInDb.length).toBe(1);
  });
  
  test('delete a growing unit should work with the owner\'s after-login user token', async () => {
    const loginReturnObj = await loginAndGetToken();
    const userId = loginReturnObj.user.body.user.user_id;
    
    //that user will only have one unit at this point
    const postedUnitId = loginReturnObj.user.body.user.own_units[0];
    await api.delete(`/api/growing_unit/${postedUnitId}`)
      .set('Authorization', `bearer ${loginReturnObj.token}`)
      .expect(204);

    const allUnits = await GrowingUnit.find({});
    const usersUnitsInDb = allUnits.filter(u => u.owner.toString() === userId.toString());
    expect(usersUnitsInDb.length).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

//GROWING UNIT TESTS

//TEST: (not urgent) post a growing unit should not work without a user token
//TEST: (not tested but done) delete image of a growing unit - should return growing unit without that image; + image deleted from S3
//TEST: (not tested but done) delete growing unit should delete the unit images in S3
//TEST: (not tested but done)  add new image to growing unit- return growing unit with 1 more image and image in S3
//TEST: (not tested but done) update growing unit image should come with the updated object with one more image



//TEST:



//USER TESTS
//TEST:(not tested but done) Add user - should return user of the same username and email and also a user id.
//TEST:(not tested but done)login should grant user token
//TEST:(not tested but done) login should grant user token and userObj. userObj contains- array of their units by id, array of units they have access to by id, email, username, userId
//TEST: (not tested but done) The logged-in user now has all their units and can fetch by id. that fetch should give all details about all units
//TEST: change password - should have changed password. use new password to login and see if that it grants user token

//TEST: delete a user - user should no longer exist
//TEST: delete a user - user should no longer exist nor their growing units, nor their growing unit's images
//TEST: //TODO: delete growing unit from user when it is deleted  
//for the user forgotpassword thing, try sending the link for that specifc user with the user id or some better solution

