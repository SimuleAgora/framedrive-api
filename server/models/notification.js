var mongoose = require('mongoose');

var Notification = mongoose.model('Notification', {
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  message: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  _createdAt: {  
      type: Date,
      default: Date.now
  }
});

module.exports = {Project};