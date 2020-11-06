const mongoose= require('mongoose');

//TODO: validation of data

const userDBReference = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
};

const growingUnitSchema = new mongoose.Schema({
  /*scientific_details_trefle: {
    id: String,
    scientific_name: String
  },*/
  nickname: {
    type: String,
    minlength: 3,
    required: true
  },
  location: String,
  supragarden: {
    type: Boolean,
    required: true
  },
  last_watered: Date, //null if supragarden,
  watering_frequency: Number,
  data_source: String,
  common_names: [String],
  owner: {
    ...userDBReference,
    required: true
  },
  shared_access: [userDBReference],
  stream_url: String,
  images: [{image_url: String, date_uploaded: Date, fileName: String,  Key: String, }]
});

//Remember to set .toJSON() on any mongoDB obj sent as a response else,
// it wont transform to what is specified in the .set('toJSON') you made below
growingUnitSchema.set('toJSON', {
  transform:(document, returnedObject) => {
    returnedObject.unit_id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


//https://mongoosejs.com/docs/models.html
const growingUnit= mongoose.model('GrowingUnit', growingUnitSchema);
module.exports = growingUnit;