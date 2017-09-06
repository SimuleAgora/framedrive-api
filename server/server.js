require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var UserController = require('./controller/userController');
var ProjectController = require('./controller/projectController');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


// PROJECTS //
app.post('/projects', authenticate, ProjectController.create);

app.get('/projects', authenticate, ProjectController.getAll);

app.get('/projects/:id', authenticate, ProjectController.read);

app.patch('/projects/:id', authenticate, ProjectController.update);

app.delete('/projects/:id', authenticate, ProjectController.remove);

// USERS //
app.post('/users', UserController.create);

app.get('/users/me', authenticate, UserController.me);

app.post('/users/login', UserController.login);

app.delete('/users/me/token', authenticate, UserController.deleteToken);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
