const growingUnitsRouter = require('express').Router();
const logger = require('../utils/logger');
const { multerUploadOptions, S3, uploadParams, deleteGrowingUnitImagesFromS3 } = require('../utils/imageHandler');
const GrowingUnit = require('../models/growing_unit');
const User = require('../models/user');



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
    
    //TODO: add user token mechanism
    //TODO: check if delete request is coming from right user. Check fullstackOpen\p4BlogList\controllers\blogs.js for example.   
    //TODO: Delete the images too
    //find the unit
    const unitToDelete = await GrowingUnit.findById(request.params.id);
    //make a list of all the image keys of that unit
    const allTheUnitImageKeys = unitToDelete.images.map(img => img.Key);
    console.log('allTheUnitImageKeys-------', allTheUnitImageKeys);

    //find the owner
    const ownerOfUnit = await User.findById(unitToDelete.owner);

    //remove the unit to be deleted from the owner's list of units
    ownerOfUnit.own_units = ownerOfUnit.own_units.filter((id) => id.toString() !== request.params.id);

    //save the updated unit
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
      Possibly there was no such user`;
      logger.error(couldntUpdateUser);
      return response.status(500).send({error: couldntUpdateUser});
    }
  } catch (error) {
    next(error);
  }
});

// /api/growing_unit
growingUnitsRouter.put('/:id', async (request, response, next) => {
  /*Don't just update because you got a request to update. Some checks need to be
    done. The user submitting the update request has to for example be the owner of
   the growing unit before they can update a unit. They have to be logged in and 
    have a user token that says they are logged in etc. */
  const unitId = request.params.id;
  //there is an Image, then it should be uploaded and added to the object
  if (request.file){//TODO
    logger.info('There is an image file ',request.file);
    //upload image

    //get image details

    /*create image object like this
    {
        "fileName": "example.png",
        "image_url": "https://ohe-test-image-upload-1.s3.eu-central-1.amazonaws.com/ad0fe675-905e-4881-8a88-5125be7b11ee.png",
        "date_uploaded": "2020-10-30T07:15:20.288Z"
    }
    and append to growingUnit before adding to db
  */


  /*const imageToAddToGrowingUnitObject = {
    'fileName': s3response.key,
    'image_url': s3response.Location,
    'date_uploaded': Date.now()
  };
  growingUnitTemporaryObject.images = imageToAddToGrowingUnitObject;*/
  }

  try {
    const replacement = request.body;
    const updatedUnit = await GrowingUnit
      .findByIdAndUpdate(unitId, replacement, { new: true });

    if (updatedUnit) {
      //logger.info(updatedUnit);
      response.json(updatedUnit.toJSON());
    } else {
      logger.error('some error updating growing unit of id ', unitId);
      response.json({
        error: 'Could not find unit to update'
      });
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
      logger.info('There is an image file ',request.file);
      console.log('There is an image file ',request.file);

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
