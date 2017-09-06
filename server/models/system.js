var mongoose = require('mongoose');

var System = mongoose.model('System', {
  requestLimitDay: {
    type: Number
  },
  changeLog: {
   type: String,
   required: true,
   minlength: 1,
   lowercase: true,
   trim: true
  },
  lockDown: {
    type: Boolean,
    default: false
  }
});

module.exports = {System};