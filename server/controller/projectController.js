require('./baseController');
var {Project} = require('../models/project');
var create = (req, res, next) => {
 var body = _.pick(req.body, ['title','category','eventDate']);
 var project = new Project({
    title: body.title,
    category: body.category,
    eventDate: body.eventDate,
    _creator: req.user._id
  });

  project.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
};

var getAll = (req, res, next) => {
 Project.find({
    _creator: req.user._id
  }).then((projects) => {
    res.send({projects});
  }, (e) => {
    res.status(400).send(e);
  });
}

var read = (req, res, next) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Project.findOne({
    _id: id,
    _creator: req.user._id
  }).then((project) => {
    if (!project) {
      return res.status(404).send();
    }

    res.send({project});
  }).catch((e) => {
    res.status(400).send();
  });
}

var update = (req, res, next) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  var body = _.pick(req.body, ['title','category','eventDate']);
  body._updatedAt =  new Date().getTime();
  Project.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((project) => {
    if (!project) {
      return res.status(404).send();
    }

    res.send({project});
  }).catch((e) => {
    res.status(400).send(e);
  })
}

var remove = (req, res, next) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Project.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((project) => {
    if (!project) {
      return res.status(404).send();
    }

    res.send({project});
  }).catch((e) => {
    res.status(400).send();
  });
}
module.exports = {create, getAll, read, update, remove};
