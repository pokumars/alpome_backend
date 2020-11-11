require('dotenv').config();
const multer= require('multer');
const AWS = require('aws-sdk');
const logger = require('./logger');
const uuid = require('uuid').v4;
const myS3Bucket= process.env.AWS_BUCKET_NAME; //bucketOwner = process.env.AWS_BUCKET_OWNER;

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
    callback(null, '');
  }
});

const multerUploadOptions = multer({ storage: storage}).single('image');

//This is a fallback for when we cannot autodetect the filetype
const contentTypesObj = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'bmp': 'image/bmp',
  'jfif': 'image/jpeg',
  'svg': 'image/svg+xml',  
  'tif': 'image/tiff',  
  'tiff': 'image/tiff',
};

/*To prevent the images auto-downloading, you have to add the ContentType and ContentDisposition.
 ContentType lets S3 knows what the filetype is and then knows it is displayable in the browser
 or not. ContentDisposition to inline tells it to display in the browser if possible */
const uploadParams = (request) => {
  logger.info('image received');
  let myFile = request.file.originalname.split('.');
  const fileType = myFile[myFile.length -1];

  return{
    Bucket: myS3Bucket,
    Key: `${uuid()}.${fileType}`,
    Body: request.file.buffer,
    ACL: 'public-read',
    ContentDisposition: 'inline',
    ContentType: request.file.mimetype || contentTypesObj[fileType],
  };
};

/**
 * 
 * @param {S3Keys[]} itemKeysToDelete - keys of the item to delete
 * @param {*} response - Response of the router request
 */
const deleteGrowingUnitImagesFromS3 = (itemKeysToDelete, response) => {
  const deleteParams = {
    Bucket: myS3Bucket, /* required */
    Delete: { /* required */
      Objects: itemKeysToDelete.map(x => Object.assign({}, {Key: x}))
    }
  };
  logger.info('deleteParams from deleteGrowingUnitImagesFromS3 -----',deleteParams);
  S3.deleteObjects(deleteParams, (error, data) => {
    if (error) {
      logger.error(error);
      return response.status(500).send({error: error});
    } else {
      logger.info('success data from S3.deleteObjects ------', data);
      return data;
    }
  });
};


module.exports = { multerUploadOptions, S3, uploadParams, deleteGrowingUnitImagesFromS3 };

