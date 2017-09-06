var mongoose = require('mongoose');

var Album = mongoose.model('Album', {
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  title: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _createdAt: {  
      type: Date,
      default: Date.now
  }
});

module.exports = {Album};