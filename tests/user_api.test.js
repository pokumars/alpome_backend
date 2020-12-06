const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./testHelper');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');
const { getObjectFromS3 } = require('../utils/imageHandler');

//delete all users except await User.deleteMany({ _id: { $ne: '5fa695a9b3f5a101307ebecf' }});


const api = supertest(app);

//login and get token
const loginAndGetToken = async (username, password) => {
  const user = await api.post('/api/login')
    .send({ 'username': username , 'password': password })
    .expect(200);
  const token = user.body.token;
  return {user, token};
};

describe('user api tests', () => {
  
  beforeAll(async () => {
    /*const masterUnit = await User.findById('5fa695a9b3f5a101307ebecf');
    console.log('masterUnit.own_units',masterUnit.own_units);
    //TODO: delete growing unit images too when u delete a growing unit 
    await GrowingUnit.deleteMany({ _id: { $ne: {$in: masterUnit.own_units } }});*/
    await GrowingUnit.deleteMany({});
    await User.deleteMany({ _id: { $ne: '5fa695a9b3f5a101307ebecf' }});



    /*let growingUnitObject = new GrowingUnit(initialGrowingUnits[0]);
    await growingUnitObject.save();*/

  
    /*await api.post('/api/growing_unit')
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
    //.attach('image', helper.imageFile);*/

    /*await api.post('/api/growing_unit')
      .field('common_names', 'tree 2')
      .field('nickname', 'tree nickname2')
      .field('location', 'Grandma\'s place f')
      .field('shared_access', '[]')
      .field('supragarden', 'false')
      .field('last_watered', 'null')
      .field('watering_frequency', '432000000')
      .field('data_source', 'null')
      .field('stream_url', 'someshite.smth')
      .field('owner', '5fa695a9b3f5a101307ebecf');*/
    
    
  /*let growingUnitObject = new GrowingUnit(initialGrowingUnits[1]);
  await growingUnitObject.save();*/
  });

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

test('Add user - should return user of the same username and email and also a user id', async () => {
  // create a user for the tests
  const response = await api.post('/api/users')
    .send({
      'username': 'testAddUser',
      'password': 'jonSnow2',
      'email': 'testAddUser@testme.com'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body.username).toBe('testAddUser');
  expect(response.body.email).toBe('testAddUser@testme.com');
  expect(response.body.own_units).toBeDefined();
  expect(response.body.units_with_access).toBeDefined();
});


test('login should grant user token', async () => {
  // create a user for the tests
  await api.post('/api/users')
    .send({
      'username': 'ngoloKante',
      'password': 'jonSnow2',
      'email': 'ngoloKante@testme.com'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // login
  const user = await api.post('/api/login')
    .send({ 'username': 'ngoloKante' , 'password':'jonSnow2' })
    .expect(200);

  expect(user.body.token).toBeDefined();
});

test('delete a user - user should no longer exist nor their growing units, nor their growing unit\'s images if the image is just 1', async () => {
  // create a user for the tests
  await api.post('/api/users')
    .send({
      'username': 'userToDelete1',
      'password': 'jonSnow26',
      'email': 'userToDelete1@testme.com'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // login
  const loginResponseObj =  await loginAndGetToken('userToDelete1','jonSnow26');
  const userToken = loginResponseObj.token;
  const userObj = loginResponseObj.user.body.user;
  // console.log('userToken-----------------', userToken);
  console.log('userObj-----------------', userObj);

  // post a growing unit with image
  const testUnit1 = await api.post('/api/growing_unit')
    .set('Authorization', `bearer ${userToken}`)
    .field('common_names', 'unit for delete user test 1')
    .field('nickname', 'unit for delete user test 1')
    .field('location', 'Grandma\'s place3')
    .field('shared_access', '[]')
    .field('supragarden', 'false')
    .field('last_watered', 'null')
    .field('watering_frequency', '432000000')
    .field('data_source', 'null')
    .field('stream_url', 'someshite.smth')
    .field('owner', userObj.user_id)
    .attach('image', helper.imageFile);


  console.log('testUnit1-----------------', testUnit1.body);
  const test1Image1Url =testUnit1.body.images[0].image_url
  const test1Image1Key =testUnit1.body.images[0].Key
  //console.log('test1Image1Url-----------------', test1Image1Url);
  //console.log('test1Image1Key-----------------', test1Image1Key);

  // post a growing unit
  const testUnit2 = await api.post('/api/growing_unit')
    .set('Authorization', `bearer ${userToken}`)
    .field('common_names', 'unit for delete user test 2')
    .field('nickname', 'unit for delete user test 2')
    .field('location', 'Grandma\'s place ')
    .field('shared_access', '[]')
    .field('supragarden', 'false')
    .field('last_watered', 'null')
    .field('watering_frequency', '432000000')
    .field('data_source', 'null')
    .field('stream_url', 'someshite.smth')
    .field('owner', userObj.user_id);

    // console.log('testUnit2-----------------', testUnit2.body);

  await api.delete('/api/growing_unit/'+ testUnit1.unit_id)
  .set('Authorization', `bearer ${userToken}`);

  await api.delete('/api/growing_unit/'+ testUnit2.unit_id)
  .set('Authorization', `bearer ${userToken}`);

  //delete the user -it shpuld also delete the users images and growing units
  await api.delete('/api/users/'+ userObj.user_id)
    .set('Authorization', `bearer ${userToken}`);

  //find the user and units again and check if they really were deleted
  const userWhichShouldBeDeleted = await User.findById(userObj.user_id);
  const unit1WhichShouldBeDeleted = await GrowingUnit.findById(testUnit1.body.unit_id);
  const unit2WhichShouldBeDeleted = await GrowingUnit.findById(testUnit2.body.unit_id);

  //expect them to not be found
  expect(userWhichShouldBeDeleted).toBeNull();
  expect(unit1WhichShouldBeDeleted).toBeNull();
  expect(unit2WhichShouldBeDeleted).toBeNull();

  const theImage = await getObjectFromS3(test1Image1Key);
  //console.log('theImage.Body in test----------------', theImage.Body)
  //console.log('theImage in test----------------', theImage)

  expect(theImage.statusCode).toBe(404);
  expect(theImage.Body).toBeUndefined();
});

afterAll(() => {
  mongoose.connection.close();
});

//USER TESTS
//TEST:(done) Add user - should return user of the same username and email and also a user id.
//TEST:(done)login should grant user token
//TEST: (not tested but done) The logged-in user now has all their units and can fetch by id. that fetch should give all details about all units
//TEST: change password - should have changed password. use new password to login and see if that it grants user token

//TEST: delete a user - user should no longer exist
//TEST: delete a user - user should no longer exist nor their growing units, nor their growing unit's images
//TEST: //TODO: delete growing unit from user when it is deleted  
//for the user forgotpassword thing, try sending the link for that specifc user with the user id or some better solution
