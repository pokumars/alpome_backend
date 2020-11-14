const growingUnitsRouter = require('express').Router();
const logger = require('../utils/logger');
const { multerUploadOptions, S3, uploadParams, deleteGrowingUnitImagesFromS3 } = require('../utils/imageHandler');
const jwt = require('jsonwebtoken');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');

/**
 * 
 * @typedef {Obect} UnitUserLink
 * @property {Object} growingUnit - The growingUnit to be acted upon
 * @property {Object} decodedToken - The decodedToken object. it gives fields username, id and iat
 * @property {Object} user - Raw user object. not .toJSOn. expect _id instead of id
 * @property {string} unitId - The unitId
 * @property {Boolean} isRequestSenderTheOwner - is the sender of the request the owner. if true they can act on it
 */
/**
 * 
 * @param {*} request 
 * @return {Object}  {@link UnitUserLink} growingUnit:Obj, decodedToken: Obj, user:Obj, unitId:string, isRequestSenderTheOwner:Bool
 */
const verifyPermission = async (request) => {
  const unitId = request.params.id;
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const growingUnit =await GrowingUnit.findById(unitId);
  const user = await User.findById(decodedToken.id);


  //Is the sender of the request the owner of the unit. Only owner should be able to update.
  
  return {
    growingUnit, decodedToken, user, unitId,
    isRequestSenderTheOwner: growingUnit.owner.toString() === user._id.toString()
  };
};


//get all growing units
growingUnitsRouter.get('/', async (request, response, next) => {

  try {
    const gUnits = await GrowingUnit
      .find({})
      .populate('owner', {username: 1, user_id: 1});

    response.json(gUnits);
    //.populate('user');
  }catch(exception){
    next(exception);
  }
});

//get single growing unit by id
growingUnitsRouter.get('/:id', async (request, response, next) => {
  try {
    const growingUnit = await GrowingUnit
      .findById(request.params.id)
      .populate('owner', {username: 1, user_id: 1});

    if (growingUnit) {
      response.json(growingUnit.toJSON());
    } else {
      response.status(404).json({
        error: 'growingUnit does not exist'
      });
      next();
    }
  } catch (error) {
    next(error);
  }
});

//  /api/growing_unit/:id
growingUnitsRouter.delete('/:id',async (request, response, next) => {

  try {
    /*Don't just delete because you got a request to delete. Some checks need to be
    done. The user submitting the delete request has to for example be the owner of
   the growing unit before they can delete a unit. They have to be logged in and 
    have a user token that says they are logged in etc. */
    const verificationReturnObj = await verifyPermission(request);
    //TODO: add user token mechanism
    //TODO: check if delete request is coming from right user. Check fullstackOpen\p4BlogList\controllers\blogs.js for example.   
    //TODO: Delete the images too
    
    //the user is the owner of the unit
    if(verificationReturnObj.isRequestSenderTheOwner){
      //find the unit
      const unitToDelete = verificationReturnObj.growingUnit;
      //make a list of all the image keys of that unit
      const allTheUnitImageKeys = unitToDelete.images.map(img => img.Key);
      logger.info('allTheUnitImageKeys-------', allTheUnitImageKeys);

      //find the owner
      const ownerOfUnit = verificationReturnObj.user;

      //remove the unit to be deleted from the owner's list of units
      const newListOfUnits = ownerOfUnit.own_units.filter((id) => id.toString() !== request.params.id);
      logger.info(newListOfUnits);
      ownerOfUnit.own_units = newListOfUnits;

      //save the updated user object
      const updatedUser = await ownerOfUnit.save();
      if(updatedUser){//if able to remove from user's list of units,
      //delete the growing unit
        const deletedUnit = await GrowingUnit.findByIdAndDelete(request.params.id);
        logger.info('deletedUnit -------',deletedUnit);

        //delete its images if there are any
        if(unitToDelete.images.length > 0 ) {logger.info(deleteGrowingUnitImagesFromS3(allTheUnitImageKeys, response));}
        return response.status(204).end();

      }else{//else nothing is changed or deleted AT ALL
        const couldntUpdateUser =`There was an error updating the user object so unit was not deleted.
        Possibly there was no such user or the user does not have the right permissions on this unit`;
        logger.error(couldntUpdateUser);
        return response.status(500).send({error: couldntUpdateUser});
      }
    }
    else{//if not correct token
      response.status(401).json({error: 'You dont have the right permissions to update this unit'});
    }
  } catch (error) {
    next(error);
  }
});

//delete a unit's image
growingUnitsRouter.delete('/unitimage/:id',async (request, response, next) => {
  //TODO: delete a unit's image
  const body = request.body;
  

  console.log(body);
  try {
    const verificationReturnObj = await verifyPermission(request);

    //is request sender the owner
    if(verificationReturnObj.isRequestSenderTheOwner){
      const growingUnit = verificationReturnObj.growingUnit;

      logger.info(deleteGrowingUnitImagesFromS3([body.fileName], response));

      //remove image from growing unit obj
      growingUnit.images = growingUnit.images.filter(imgObj => imgObj.filename !==body.filename);
      const updatedGrowingUnit = await growingUnit.save();

      return response.status(200).send(updatedGrowingUnit.toJSON());
    }else {
      response.status(401).json({error: 'You dont have the right permissions to update this unit'});
    }
  } catch (error) {
    next(error);
  }
});

// /api/growing_unit
growingUnitsRouter.put('/:id', async (request, response, next) => {
  //all updates to a growing unit except adding of new image
  try {
    const verificationReturnObj = await verifyPermission(request);
    

    //Is the sender of the request the owner of the unit. Only owner should be able to update.
    if(verificationReturnObj.isRequestSenderTheOwner){
      
      logger.info('PUT request.body---------------------',request.body);
      const replacement =  Object.assign(verificationReturnObj.growingUnit , request.body);
  
      const updatedUnit = await GrowingUnit
        .findByIdAndUpdate(verificationReturnObj.unitId, replacement, { new: true });
      
      if (updatedUnit) {
        //logger.info(updatedUnit);
        response.json(updatedUnit.toJSON());
      } else {
        logger.error('some error updating growing unit of id ', verificationReturnObj.unitId);
        response.json({
          error: 'Could not find unit to update'
        });
      }
    }else {
      response.status(401).json({error: 'You dont have the right permissions to update this unit'});
    }
  } catch (error) {
    next(error);
    response.status(400);
  }
});


const saveGrowingUnit = (unitToSave, next) => {
  //uploadedGrowingUnit is the object mongodb returns to us after it confirms having received it.
  const uploadedGrowingUnit = new GrowingUnit(unitToSave);
  return uploadedGrowingUnit.save()
    .then(savedGrowingUnit => savedGrowingUnit.toJSON())
    .then(savedAndFormattedGrUnit => {
      return savedAndFormattedGrUnit;
    })
    .catch(error => next(error));
};

const saveGrowingUnitAndAddToUserObject = async (growingUnitToSave, userId, response, next) => {
  //save growing unit and then add that unit's id to the list of units owned by that user
  try {
    
    //find the user saving the growing unit
    const user = await User.findById(userId);
    logger.info('----------------uuserId in request ---', userId);
    logger.info('----------------user that is posting this unit', user);
    if(!user) {
      const errorMsg = 'User does not exist. So Could not save the growing unit. Check user id (aka owner in request body)';
      logger.error('saveGrowingUnitAndAddToUserObject------- ',errorMsg);
      return response.status(400).json({error: errorMsg});
    }

    //save the growing unit
    const savedUnit = await saveGrowingUnit(growingUnitToSave, next);
    logger.info('-------------------------unit that has been saved ', savedUnit);

    //add that unit's id to the user's array of units
    user.own_units = user.own_units.concat(savedUnit.unit_id);
    const updatedUser = await user.save();
    logger.info('-------------------------user that has been updated ', updatedUser);

    return savedUnit;
  } catch (error) {
    next(error);
    return;
  }
};

//add a new image to a unit
growingUnitsRouter.post('/unitimage/:id', multerUploadOptions, async (request, response, next) => {
  try {
    const verificationReturnObj = await verifyPermission(request);

    if (!request.file){
      //they didnt send any image
      return response.status(400).end();
    }

    if(verificationReturnObj.isRequestSenderTheOwner){ //request sender is not the unit owner
      //find the growing unit that is getting an image 
      const unitToUpdate = verificationReturnObj.growingUnit;

      logger.info('There is an image file ',/*request.file */);
      //upload image
      S3.upload(uploadParams(request), async (error, data) => {
        if(error){
          logger.error(error);
          response.status(500).send(error);
          return error;
        }

        /*When successful the response returned by S3 aka 'data' is
      { ETag: '"13d18b81cc70cd3bea6b7ea60e504373"',
        Location:'https://[BucketName].s3.amazonaws.com/[objectName.filetype]',
        key: 'example.png',
        Key: 'example.png',
        Bucket: '[BucketName]' 
      }*/

        //get saved image details and create image object
        const imageToAddToGrowingUnitObject = {
          'fileName': data.key,
          'Key': data.Key,
          'image_url': data.Location,
          'date_uploaded': Date.now()
        };

        unitToUpdate.images = unitToUpdate.images.concat(imageToAddToGrowingUnitObject);
        const updatedUnit = await unitToUpdate.save();
        logger.info('-------------------------unit that has been updated ', updatedUnit);
        //and append to growingUnit before adding to db
        return response.status(201).send(updatedUnit.toJSON());
      });

    }else{//request sender is not the unit owner
      return response.status(401).json({error: 'You dont have the right permissions to update this unit'});
    }
  } catch (error) {
    next(error);
  }
});


// /api/growing_unit
growingUnitsRouter.post('/', multerUploadOptions, async (request, response, next) => {
  const body = request.body;
  logger.info('POST an object /api/growing_unit', body);

  if (body.nickname === undefined  || body.location === undefined || body.supragarden === undefined) {
    logger.error( 'body.nickname-----------',body.nickname);
    logger.error( 'body.location-----------',body.location);
    logger.error( 'body.supragarden -----------',body.supragarden);
    return response.status(400).json({
      error: `some information were missing in the request.
      Most likely plant nickname, plant location, or Supragrden(True/false)`
    });
  }

  //Find the user and then add the growing unit to them
  try {//if else clause comes in for image or no image upload 
    
    //TODO: owner should be required. If no owner object should fail.
    //TODO add or find out about --> "plants": [id_from_trefle: integer],//takes one plant if supragarden is false
    const growingUnitTemporaryObject = {
      nickname: body.nickname,
      location: body.location,
      supragarden: body.supragarden,
      last_watered: null, //null if supragarden,
      watering_frequency: body.watering_frequency || null,
      data_source: body.data_source || null,
      common_names: typeof(body.common_names) === 'string' ? [body.common_names] : [...body.common_names],
      owner: body.owner,
      shared_access: [],
      stream_url: body.url,
    };
    //If user doesnt exist/cant be found dont proceed at all
    const user = await User.findById(body.owner);
    if(!user) {
      const errorMsg = 'User does not exist. So Could not save the growing unit. Check user id (aka owner in request body)';
      logger.error('saveGrowingUnitAndAddToUserObject------- ',errorMsg);
      return response.status(400).json({error: errorMsg});
    }
    
    //there is an Image, then it should be uploaded and added to the object
    if (request.file){

      //TODO: check whether the one uploading is the right user to upload
      logger.info('There is an image file ******************',/*request.file*/);
      //console.log('There is an image file ',request.file);

      //upload image
      S3.upload(uploadParams(request), async (error, data) => {
        if(error){
          logger.error(error);
          response.status(500).send(error);
          return error;
        }

        /*When successful the response returned by S3 aka 'data' is
        { ETag: '"13d18b81cc70cd3bea6b7ea60e504373"',
          Location:'https://[BucketName].s3.amazonaws.com/[objectName.filetype]',
          key: 'example.png',
          Key: 'example.png',
          Bucket: '[BucketName]' 
        }*/

        //get saved image details and create image object
        const imageToAddToGrowingUnitObject = {
          'fileName': data.key,
          'Key': data.Key,
          'image_url': data.Location,
          'date_uploaded': Date.now()
        };

        logger.info('imageToAddToGrowingUnitObject ', imageToAddToGrowingUnitObject);

        //add image object to gull growing unit object
        growingUnitTemporaryObject.images = imageToAddToGrowingUnitObject;
        logger.info('growingUnitTemporaryObject ', growingUnitTemporaryObject);
        
        logger.info('--------------unit with image ---------------');
        //TODO change from using body.owner in finding user to using the token to find user
        const savedGrowingUnit = await saveGrowingUnitAndAddToUserObject(growingUnitTemporaryObject, body.owner, response, next);
        response.status(201).json(savedGrowingUnit);

      });
    } else {
      logger.info('--------------There is no image file with this unit ---------------');
      //TODO change from using body.owner in finding user to using the token to find user
      const savedGrowingUnit = await saveGrowingUnitAndAddToUserObject(growingUnitTemporaryObject, body.owner, response, next);
      response.status(201).json(savedGrowingUnit);
    }

  } catch (error) {
    next(error);
  }
});


//TODO: delete image from growing unit (that means from S3 as well)
module.exports = growingUnitsRouter;
