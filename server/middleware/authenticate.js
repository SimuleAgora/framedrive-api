require('./../controller/baseController');

var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    var newRequests = user.requests + 1;
    User.findOneAndUpdate({_id: user._id}, {$set: {requests: newRequests}}, {new: true}).then();

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(200).send({status:401});
  });
};

module.exports = {authenticate};
