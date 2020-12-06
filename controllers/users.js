const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../utils/config');
const GrowingUnit = require('../models/growing_unit');
const { deleteGrowingUnitImagesFromS3 } = require('../utils/imageHandler');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const populatedGrowingUnitFields = {nickname: 1, supragarden: 1,location: 1, unit_id: 1, };

/**
 * 
 * @param {*} request 
 * @return {Object}  {@link UnitUserLink} growingUnit:Obj, decodedToken: Obj, user:Obj, unitId:string, isRequestSenderTheOwner:Bool
 */
const verifyPermission = async (request) => {
  const userId = request.params.id;
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET); // id is in property .id

  //console.log('userId----------------',userId);

  const user = await User.findById(userId); // id is in property ._id
  //console.log('decodedToken----------------',decodedToken);
  //console.log('user------------------',user);
  //Is the sender of the request the owner of the unit. Only owner should be able to update.
  //console.log('decodedUserFromToken._id.toString() === user._id.toString() ----',decodedToken.id.toString() === user._id.toString())

  return {
    decodedToken, user, userId,
    isRequestSenderTheOwner: decodedToken.id.toString() === user._id.toString()
  };
};

// /api/users/ Get all users
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('own_units', populatedGrowingUnitFields) ;
    logger.info('GET /api/users');
    response.send(users);
  } catch (error) {
    next(error);
  }
});

// /api/users/:id Get a single user by id
usersRouter.get('/:id', async (request, response, next) => {
  //TODO: verify the user is the correct one
  //TODO:The logged-in user now has all their units and can fetch by id. that fetch should give all details about all units

  const id = request.params.id;
  try {      
    const user = await User.findById(id).populate('own_units');
    logger.info(user);

    if (user) {
      response.send(user.toJSON());
    } else {
      response.status(400).json({
        error: 'user does not exist or not found'
      });
    }
  } catch (error) {
    next(error);
  }
});

// /api/users/:id delete a single user
usersRouter.delete('/:id',async (request, response, next) => {
  //TODO: when you delete a unit, delete it from one that people have access to. Or then do it when people try to
  //TODO: confirm user  has token before they can delete themselves.
  //TODO: confirm that user can only delete they themselves
  //TODO: delete user means delete all their uploaded units as well as their images
  const verificationReturnObj = await verifyPermission(request);
  const id = request.params.id;
  try {
    if(verificationReturnObj.isRequestSenderTheOwner){
      const user = await User.findById(id,  { username: 1, own_units:1});
      if(!user) return response.status(204);//204 doesnt send any message with it
    
      //find all thegrowing units in user.own_units by id
      const theUsersGrowingUnits = await GrowingUnit.find({_id:{
        $in: [...user.own_units]
      }});
  
      //console.log('theUsersGrowingUnits------------', theUsersGrowingUnits);
      //TEST: if one user has 3 units that all have 3 images. Make sure all images are deleted
      //1. get all units to be deleted, map that array and get all image objects which is itself an array
      //2. Flatten from Array of Array of objects [[{imgObj},{imgObj}], [{imgObj},{imgObj}]] to array of objects[{imgObj}]
      //3. use map to get the s3 key of the images and put that in an array [key, key, key]
      const allThisUsersUnitImageKeys = theUsersGrowingUnits.map(u => u.images).flat(2).map(img => img.Key);
      console.log('allThisUsersUnitImageKeys------------', allThisUsersUnitImageKeys);

      if(allThisUsersUnitImageKeys.length > 0){
        const deletionResponse = await deleteGrowingUnitImagesFromS3(allThisUsersUnitImageKeys, response);

        logger.info('deleting all files of the user in s3', deletionResponse);
      }

      await GrowingUnit.deleteMany({_id:{
        $in: [...user.own_units]
      }});

      await User.findByIdAndDelete(id);
    
      response.status(204).end();
    //response.status(204).send(`user has been deleted ${allUsersUnitImages}`);
    }else {
      response.status(401).json({error: 'You dont have the right permissions to delete this user'});
    }
  } catch (error) {
    next(error);
  }
});

// /api/users add a user
usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    if(!body.username, !body.email, !body.password) {
      return response.status(400).json({
        error: `Some information is missing.
       Either username, or email or password`
      });
    }
    else if (body.password.length < 4){
      return response.status(400).send({ error: 'password must be longer than 3 characters' });
    }
    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

    const userObj = {
      email: body.email,
      username: body.username,
      passwordHash: passwordHash, //TODO: change this to actual passwordHash
      own_units: body.own_units|| [],
      units_with_access:body.units_with_access || []
    };
    logger.info('userObj to save ----', userObj);
    const user = new User(userObj);

    const savedUser = await user.save();
  
    response.json(savedUser.toJSON());
  } catch (exception) {
    next(exception);
  }
});

usersRouter.put('/:id', async (request, response, next) => {
  //all updates to a growing unit except adding of new image
  try {
    const verificationReturnObj = await verifyPermission(request);
    

    //Is the sender of the request the the owner of the account. Only owner should be able to update.
    if(verificationReturnObj.isRequestSenderTheOwner){
      
      logger.info('PUT request.body---------------------',request.body);
      // atm only email is updatable by the user.
      delete request.body.passwordHash;
      // any property sent that isnt in the schema does not get saved
      const replacement =  Object.assign(verificationReturnObj.user , request.body);
      logger.info('replacement---------------------', replacement);
  
      const updatedUser = await User
        .findByIdAndUpdate(verificationReturnObj.userId, replacement, { new: true });
      
      if (updatedUser) {
        response.json(updatedUser.toJSON());
      } else {
        logger.error('some error updating user of id ', verificationReturnObj.userId);
        response.json({
          error: 'Could not find user to update'
        });
      }
    }else {
      response.status(401).json({error: 'You dont have the right permissions to update this user'});
    }
  } catch (error) {
    next(error);
    response.status(400);
  }
});


module.exports = usersRouter;

