const logger = require("./logger");

const getTokenFrom= (request, response, next) => {
  const authorization = request.get('authorization');
  

  if(authorization && authorization.toLowerCase().startsWith('bearer ')){    
    request.token = authorization.substring(7);
    
  }
  //console.log('token field ---------------->',request.token);
  //console.log('request.get(authorization)---------------->',request.get('authorization'));
  
  next();
};

const errorHandler= (error, request, response, next) => {
  if(error.name==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({ error: 'malformatted id' });
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message });
  } else if( error.name === 'JsonWebTokenError'){
    return response.status(401).json({
      error: 'invalid token'
    });
  }
  logger.error(error.message);

  next(error);
};


module.exports = {
  getTokenFrom, errorHandler
};