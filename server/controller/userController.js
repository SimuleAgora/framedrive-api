require('./baseController');

var {User} = require('./../models/user');


var me = (req, res, next) => {
 res.send(req.user);
};
var login = (req, res, next) => {
 var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
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
  var body = _.pick(req.body, ['email', 'password', 'studio','type']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
};



module.exports = {me, login, deleteToken, create};
