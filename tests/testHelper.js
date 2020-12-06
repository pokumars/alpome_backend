const fs = require('fs');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');

const initialGrowingUnits = [
  {
    'common_names': 'image tree 1',
    'nickname': 'tree nickname1',
    'location': 'Grandma\'s place3',
    'shared_access': [],
    'supragarden': false,
    'last_watered': null,
    'watering_frequency': '432000000',
    'data_source': null,
    'stream_url': 'someshite.smth',
    'owner': '5fa695a9b3f5a101307ebecf'
  },
  {
    'nickname': 'no image tree 1',
    'common_names': [
      'Grandma Tree'
    ],
    'shared_access': [],
    'location': 'Grandma\'s place',
    'supragarden': false,
    'last_watered': null,
    'watering_frequency': 432000000,
    'data_source': null,
    'stream_url': 'someshite.smth',
    'owner': '5fa695a9b3f5a101307ebecf'
  }
];
//const unitsInDB = await GrowingUnit.find({}).toJSON()

const unitsInDb = async () => {
  const users = await GrowingUnit.find({});
  return users.map(u => u.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};
const anUpdatedUnit=     {

  'nickname': 'replacement name',
  'location': 'Hakunila',
  'supragarden': true,
  'last_watered': null,
  'watering_frequency': 432000000,
  'data_source': 'null',

};
const testUserForGrowingUnitTests = {
  'username': 'tokenUser1',
  'password': 'jonSnow',
  'email': 'tokenUser1@testme.com'
};

const testUserForUserApiTests = {
  'username': 'tokenUser2',
  'password': 'jonSnow2',
  'email': 'tokenUser2@testme.com'
};

const imagePath = 'C:/Users/ohene/Downloads/taffel_joulukalenteri.png';
const imageFile = fs.createReadStream(imagePath);

const imagePath2 = 'C:/Users/ohene/Downloads/reactjs_image.png';
const imageFile2 = fs.createReadStream(imagePath2);


module.exports = {
  initialGrowingUnits,
  imageFile,
  imageFile2,
  unitsInDb,
  usersInDb,
  anUpdatedUnit,
  testUserForGrowingUnitTests,
  testUserForUserApiTests
};