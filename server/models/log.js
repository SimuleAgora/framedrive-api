var mongoose = require('mongoose');

var Log = mongoose.model('Log', {
  ip: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  agent: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _createdAt: {  
      type: Date,
      default: Date.now
  }
});

module.exports = {Log};