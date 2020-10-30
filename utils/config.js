require('dotenv').config();

let MONGODB_URI = process.env.MONGO_DB_URI;
let MONGO_DB_TRIAL_URI = process.env.MONGO_DB_TRIAL_URI;
let PORT = process.env.PORT;

module.exports = {
  MONGO_DB_TRIAL_URI,
  MONGODB_URI,
  PORT
};