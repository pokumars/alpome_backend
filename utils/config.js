require('dotenv').config();

let MONGODB_URI = process.env.MONGO_DB_URI;
let PORT = process.env.PORT;
let AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGO_DB_TRIAL_URI;
}

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGO_DB_TRIAL_URI;
}

if (process.env.NODE_ENV === 'foranna') {
  MONGODB_URI = process.env.MONGO_DB_ANNA;
}
//use main s3 bucket if we are in production mode
if (process.env.NODE_ENV === 'production') {
  AWS_BUCKET_NAME = process.env.AWS_BUCKET_PROD_NAME;
}


let AWS_ID = process.env.AWS_ID;
let AWS_SECRET = process.env.AWS_SECRET;


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