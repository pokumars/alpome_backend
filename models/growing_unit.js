const mongoose= require('mongoose');

//TODO: validation of data

const growingUnitSchema = new mongoose.Schema({
  /*scientific_details_trefle: {
    id: String,
    scientific_name: String
  },*/
  nickname: String,
  location: String,
  supragarden: Boolean,
  last_watered: Date, //null if supragarden,
  watering_frequency: Number,
  data_source: String,
  common_names: [String],
  owner: String,
  shared_access: [String],
  stream_url: String,
  images: [{image_url: String, date_uploaded: Date, }]
});


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