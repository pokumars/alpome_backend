require('dotenv').config();

let MONGODB_URI = process.env.MONGO_DB_URI;
let MONGO_DB_TRIAL_URI = process.env.MONGO_DB_TRIAL_URI;
let PORT = process.env.PORT;

let AWS_ID = process.env.AWS_ID;
let AWS_SECRET = process.env.AWS_SECRET;
let AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;


//TODO: add the other environment keys
module.exports = {
  MONGO_DB_TRIAL_URI,
  MONGODB_URI,
  PORT,
  AWS_ID,
  AWS_SECRET,
  AWS_BUCKET_NAME,
};