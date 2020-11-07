/*Extracting logging into its own module is a good idea in more ways than one.
 If we wanted to start writing logs to a file or send them to an external logging 
 service we would only have to make changes in one place. */
const info = (...params) => {
  //we dont wanna log generic stuff in testing mode. only errors should be logged in testing mode
  if (process.env.NODE_ENV !== 'test'){
    console.log(...params);
  }  
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info, error
};