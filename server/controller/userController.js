require('./baseController');

var {User} = require('./../models/user');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var me = (req, res, next) => {
 res.send(req.user);
};
var login = (req, res, next) => {
 var body = _.pick(req.body, ['email', 'password']);
 
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({token: token, result:user, status:200});
    });
  }).catch((e) => {
    console.log(e);
    res.status(200).send({status: 400});
  });
};

var deleteToken = (req, res, next) => {
 req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
};

var create = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password', 'studio','account','facebook','google']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
};

var loginFacebook = (req, res, next) => {
 var body = _.pick(req.body, ['id', 'hash']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
};
var getUserByFacebook = (req, res, next) => {

 var body = _.pick(req.body, ['id', 'hash']);
 if(body.hash != '95417A6CA0CE8EC2E72F9190788FC5DFDD58E5DE')
    return res.status(200).send({status: 401});

  User.findOne({'facebook.id': body.id}).then((user) => {
    if(!user){
      return res.status(200).send({status: 404});
    } 
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({user, status: 200});
    });
  }).catch((e) => {
    console.log(e);
    res.status(200).send({status: 400});
  });
};

var update = (req, res, next) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(200).send({status: 400});
  }
  var body = _.pick(req.body, ['facebook','google','studio']);
  body._updatedAt =  new Date().getTime();
  User.findOneAndUpdate({_id: id, _id: req.user._id}, {$set: body}, {new: true}).then((user) => {
    if (!user) {
    return res.status(200).send({status: 404});
    }
    return res.status(200).send({user, status:200});
  }).catch((e) => {
    return res.status(200).send({status: 400, e:e});
  })
}

module.exports = {me, login, deleteToken, create, getUserByFacebook, loginFacebook, update};
