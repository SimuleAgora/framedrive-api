var mongoose = require('mongoose');

var Project = mongoose.model('Project', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    lowercase: true,
    trim: true
  },
  eventDate: {  
      type: Date
  },
  _createdAt: {  
      type: Date,
      default: Date.now
  },
  _updatedAt: {
      type: Date,
      default: Date.now
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Project};