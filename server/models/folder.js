var mongoose = require('mongoose');

var Folder = mongoose.model('Folder', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  _project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _album: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _createdAt: {  
      type: Date,
      default: Date.now
  }
});

module.exports = {Folder};