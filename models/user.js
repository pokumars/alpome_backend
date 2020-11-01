const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const growingUnitDBReference = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'GrowingUnit'
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim:true
  },
  passwordHash: String,
  own_units: [ growingUnitDBReference ],
  units_with_access: [ growingUnitDBReference ],
  email: {
    type: String,
    unique: true,
    required: true,
  },
});


userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.user_id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;

    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model('User', userSchema);