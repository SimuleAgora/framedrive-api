var moment = require('moment');
require('./baseController');
var {Project} = require('../models/project');
var {Photo} = require('../models/photo');

const _ = require('lodash');
const {ObjectID} = require('mongodb');

var create = (req, res, next) =>{

  var projectId = req.params.project;
  var folderId = req.params.folder;

 var body = _.pick(req.body, [
    'id',
    'name',
    'bucket',
    'size',
    'selfLink',
    'mediaLink'
  ]);
  if (!ObjectID.isValid(projectId) || !body.id || !body.name || !body.bucket || !body.size || !body.selfLink || !body.mediaLink) {
    return res.status(200).send({status:404});
  }

  Project.findOne({
    _id: projectId,
    _creator: req.user._id
  }).then((project) => {
    if (!project) {
      return res.status(200).send({status:404});
    }

    project.photos.push({
      id: body.id,
      name: body.name,
      bucket:body.bucket,
      size:body.size,
      selfLink:body.selfLink,
      mediaLink:body.mediaLink,
      folder: folderId,
      type: "photo",
      _createdAt: moment().format("DD/MM/YYYY HH:mm:ss")  
    });
     project.save().then((project) => {
          res.status(200).send({status:200, photo: project.photos[project.photos.length-1] });
     });

  }).catch((e) => {
    res.status(200).send({status:400});
  });

}


module.exports =  {create};

