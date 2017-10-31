require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var UserController = require('./controller/userController');
var ProjectController = require('./controller/projectController');
var PhotoController = require('./controller/photoController');
var ClientsController = require('./controller/clientsController');

var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
  res.header("Access-Control-Expose-Headers", "true");
  res.header("Access-Control-Allow-Credentials","true");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  next();
});

// PROJECTS //
app.post('/projects', authenticate, ProjectController.create);

app.post('/projects/folder', authenticate, ProjectController.createFolder);

app.get('/projects', authenticate, ProjectController.getAll);

app.get('/projects/:id', authenticate, ProjectController.read);

app.get('/projects/:id/:folder', authenticate, ProjectController.read);

app.patch('/projects/:id', authenticate, ProjectController.update);

app.delete('/projects/:id', authenticate, ProjectController.remove);

// PHOTOS //
app.post('/photos/:project/:folder', authenticate, PhotoController.create);
  
// CLIENTS //
app.post('/clients/:project', authenticate, UserController.createClient);

app.patch('/clients/setAccount', UserController.userSettings);

// USERS //
app.post('/users', UserController.create);

app.get('/users/me', authenticate, UserController.me);

app.post('/users/login', UserController.login);

app.post('/users/login/facebook', UserController.loginFacebook);

app.post('/users/login/auth/facebook', UserController.getUserByFacebook);

app.patch('/users/:id', authenticate, UserController.update);

app.post('/users/login', UserController.login);
	
app.delete('/users/me/token', authenticate, UserController.deleteToken);

app.listen(port, () => {
  console.log('########## API #############');
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
