var mongoose = require('mongoose');

var Photo = mongoose.model('Photo', {
  _project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _folder: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default:'/'
  },
  type: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ['thumbnail','photo'],
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

module.exports = {Photo};