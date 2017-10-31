const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Project} = require('./../../models/project');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  studio: 'framedrive',
  account: 'admin',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass',
  studio: 'studio Maneiro',
  account: 'admin',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const projectOneId = new ObjectID();
const projectTwoId = new ObjectID();
const folderOneId = new ObjectID();
const folderTwoId = new ObjectID();

const projects = [{
  _id: projectOneId,
  title: 'Maria + José',
  category: 'Casamento',
  date: '10/10/2010',
  _creator: userOneId,
  folders: [{
    _id: folderOneId,
    folderAbove: '/',
    name: 'folderOne',
    folderEncoded: 'folderOne'
  }]
}, {
  _id: projectTwoId,
  title: 'Formatura Ecompo',
  category: 'Formatura',
  date: '20/01/2017',
  folders: [{
    _id: folderTwoId,
    folderAbove: '/',
    name: 'folderTwo',
    folderEncoded: 'folderTwo'
  }],
  _creator: userTwoId
}];


const clientOneId = new ObjectID();
const clientTwoId = new ObjectID();
const clients = [{
  _id: clientOneId,
  email: 'client@one.com',
  reference: userOneId,
  project: projectOneId,
  account: 'client',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: clientOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: clientTwoId,
  email: 'client@two.com',
  reference: userTwoId,
  project: projectTwoId,
  account: 'client',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: clientTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    var clientOne = new User(clients[0]).save();
    var clientTwo = new User(clients[1]).save();

    return Promise.all([userOne, userTwo, clientOne, clientTwo])
  }).then(() => done());
};

const populateProjects = (done) => {
  Project.remove({}).then(() => {
    var projectOne = new Project(projects[0]).save();
    var projectTwo = new Project(projects[1]).save();

    return Promise.all([projectOne, projectTwo])
  }).then(() => done());
};



module.exports = {users, populateUsers, projects, populateProjects, clients};
