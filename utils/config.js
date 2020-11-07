require('dotenv').config();

let MONGODB_URI = process.env.MONGO_DB_URI;
let PORT = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGO_DB_TRIAL_URI;
}

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGO_DB_TRIAL_URI;
}

let AWS_ID = process.env.AWS_ID;
let AWS_SECRET = process.env.AWS_SECRET;
let AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

let SECRET = process.env.SECRET;
let SALT_ROUNDS = 10;


//TODO: add the other environment keys
module.exports = {
  MONGODB_URI,
  PORT,
  AWS_ID,
  AWS_SECRET,
  AWS_BUCKET_NAME,
  SECRET,
  SALT_ROUNDS,
};