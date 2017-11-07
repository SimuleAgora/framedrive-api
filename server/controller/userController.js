require('./baseController');

var {User} = require('./../models/user');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {User} = require('./../models/user');
var {Project} = require('../models/project');
var {sendEmail} = require('./../email');

var me = (req, res, next) => {
    res.status(200).send({status: 200, user: req.user});
};
var login = (req, res, next) => {
 var body = _.pick(req.body, ['email', 'password']);
 
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({token: token, result:user, status:200});
    });
  }).catch((e) => {
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

var createClient = (req, res, next) => {
  var body = _.pick(req.body, ['email']);
  User.findOne({
    email: body.email
  }).then((user) => {
    if (!user) {
      console.log('Este é um novo cliente');
      body.account = 'client';
      body.reference = req.user._id;
      var user = new User(body);
    }
    Project.findProject(req.user._id, req.params.project).then((project) => {
      var found = false;
        for(var i = 0; i < user.projectsClient.length; i++) {
            if (user.projectsClient[i].project ==  req.params.project) {
                found = true;
                break;
            }
        }
      if (found) {
        console.log('http://127.0.0.1/framedrive/selection/newUser/' + user._id);
        //sendEmail(body.email, 'newClient', [req.user.studio, project.project.title, user._id ]).then(res.status(200).send({status: 200, user:user}));    
        console.log('Projeto já adicionado ao cliente');
        return res.status(200).send({status: 200,user: user});
      }

      user.projectsClient.push({ project: req.params.project});
     
      user.save().then((user) => {
        console.log('http://127.0.0.1/framedrive/selection/newUser/' + user._id);
        //sendEmail(body.email, 'newClient', [req.user.studio, project.project.title, user._id ]).then(res.status(200).send({status: 200, user:user}));    
        res.status(200).send({status: 200,user: user});
      }).catch((e) => {
        res.status(200).send({status: 400,e:e});
      });
    });
  }).catch((e) => {
    res.status(200).send({status: 400,e: e});
  });
};
var userSettings = (req, res, next) => {
  var body = _.pick(req.body, ['password', 'user_id']);
  User.findOne({
      _id: body.user_id
  }).then((user) => {
      user.password = body.password;
      user.save().then(() => {
        user.generateAuthToken().then((token) => {
          res.header('x-auth', token).status(200).send({status: 200, user:user, token:token});
        });
      }).catch((e) => {
        res.status(200).send({status: 400, e:e});
      });
  }).catch((e) => {
      res.status(200).send({status: 400, e:e});
  });
};

var create = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password', 'studio','account','facebook','google']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send({status:200, user:user});
  }).catch((e) => {
    res.status(200).send({status:400, e:e});
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

module.exports = {me, login, deleteToken, create, getUserByFacebook, loginFacebook, update, createClient, userSettings};
