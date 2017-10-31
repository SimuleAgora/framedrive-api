const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Project} = require('./../models/project');
const {User} = require('./../models/user');
const {users, populateUsers, projects, populateProjects, clients} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateProjects);

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(401);
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'p1p0c@s';
    var studio = 'framedrive';

    request(app)
      .post('/users')
      .send({
        email,
        password,
        studio
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.user._id).toExist();
        expect(res.body.user.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        User.findOne({
          email
        }).then((user) => {
          expect(user).toExist();
          expect(user.email).toExist();
          expect(user.password).toExist();
          expect(user.studio).toExist();
          expect(user.email).toBe(email);
          expect(user.studio).toBe(studio);
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(400);
        expect(res.body.e).toExist();
        expect(res.body.e.errors.password).toExist();
        expect(res.body.e.errors.email).toExist();
      })
      .end((err) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        done();
      });

  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(400);
        expect(res.body.e).toExist();
        expect(res.body.e.code).toExist();
        expect(res.body.e.code).toBe(11000);
      })
      .end((err) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }
        done();
      });
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.headers['x-auth']).toExist();
        expect(res.body.token).toExist();
        expect(res.body.result).toExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(400);
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('POST /projects', () => {
  it('should create a new project', (done) => {
    var title = 'Ensaio pornográfico';
    var category = 'Ensaio';
    var date = '15/12/2017';

    request(app)
      .post('/projects')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        title,
        category,
        date
      })
      .expect(200)
      .expect((res) => {
        mockProjectId = res.body.project._id;
        expect(res.body.project).toExist();
        expect(res.body.status).toBe(200);
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        Project.findById(mockProjectId).then((project) => {
          expect(project).toExist();
          expect(project._creator).toEqual(users[0]._id);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create project with invalid body data', (done) => {
    request(app)
      .post('/projects')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(400);
        expect(res.body.e).toExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        Project.find().then((projects) => {
          expect(projects.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /projects', () => {
  it('should get all projects', (done) => {
    request(app)
      .get('/projects')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.projects.length).toBe(1);
        expect(res.body.status).toBe(200);
      })
      .end(done);
  });
});

describe('GET /projects/:id', () => {
  it('should return project doc', (done) => {
    request(app)
      .get(`/projects/${projects[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.project.title).toBe(projects[0].title.toLowerCase());
        expect(res.body.status).toBe(200);
        expect(res.body.folders).toExist();
        expect(res.body.photos).toExist();
      })
      .end(done);
  });

  it('should not return project doc created by other user', (done) => {
    request(app)
      .get(`/projects/${projects[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(404);
      })
      .end(done);
  });

  it('should return 404 if project not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/projects/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(404);
      })
      .end(done);
  });
});

describe('POST /projects/folder', () => {
  var folderID;
  it('should create a new folder under the root', (done) => {
    var folder = 'Pasta da dona maria';
    var folderAbove = '/';
    var _project = projects[0]._id;

    request(app)
      .post('/projects/folder')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        folder,
        folderAbove,
        _project
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.project).toExist();
        //console.log(res.body);
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        Project.find({
          _id: _project
        }).then((projects) => {
          expect(projects[0].folders[1].folderAbove).toBe("/");
          expect(projects[0].folders[1].name).toBe(folder.toLowerCase());
          expect(projects[0].folders[1]._createdAt).toExist();
          expect(projects[0].folders[1].folderEncoded).toExist();
          folderID = projects[0]._id;
          done();
        }).catch((e) => done(e));
      });
  });

  it('should create a new sub-folder', (done) => {
    var folder = 'Pasta do seu jorge';
    var folderAbove = folderID;
    var _project = projects[0]._id;

    request(app)
      .post('/projects/folder')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        folder,
        folderAbove,
        _project
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.project).toExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        Project.find({
          _id: _project
        }).then((projects) => {
          expect(projects[0].folders[1].folderAbove).toEqual(folderAbove);
          expect(projects[0].folders[1].name).toBe(folder.toLowerCase());
          expect(projects[0].folders[1]._createdAt).toExist();
          expect(projects[0].folders[1].folderEncoded).toExist();

          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a new folder under the root', (done) => {
    request(app)
      .post('/projects/folder')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        folder: 'test',
        _project: projects[0]._id
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(404);
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }
        done();
      });
  });
});

describe('GET /projects/:id/:folder', () => {
  it('should return project doc with the sub-folders under folderID', (done) => {
    request(app)
      .get(`/projects/${projects[0]._id.toHexString()}/${projects[0].folders[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.project.title).toBe(projects[0].title.toLowerCase());
        expect(res.body.status).toBe(200);
        expect(res.body.folders).toExist();
        expect(res.body.photos).toExist();
      })
      .end(done);
  });
  it('should not return project doc with the sub-folders under folderID', (done) => {
    request(app)
      .get(`/projects/${projects[0]._id.toHexString()}/abacaxi`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(404);
      })
      .end(done);
  });
});


describe('POST /clients/:project', () => {
  var clientOneID;
  it('should create new client', (done) => {
    request(app)
      .post(`/clients/${projects[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        email: 'samuelmachado31@gmail.com'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.user).toExist();
        clientOneID = res.body.user._id;
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        User.findOne({
          _id: clientOneID
        }).then((user) => {
          expect(user.reference).toEqual(users[0]._id);
          expect(user.project).toEqual(projects[0]._id);
          expect(user.password).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create new client', (done) => {
    request(app)
      .post(`/clients/${projects[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        email: 'notAnEmail'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(400);
        expect(res.body.user).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }

        done();
      });
  });
});

describe('PATCH /clients/setAccount', () => {
  it('should set password for the client', (done) => {
    var password = 'p1p0c@s';
    request(app)
      .patch(`/clients/setAccount`)
      .send({
        password,
        user_id: clients[0]._id
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.user).toExist();
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }










        User.findOne({
          _id: clients[0]._id
        }).then((user) => {
          expect(user.password).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not set password for the client, password is too short', (done) => {
    var password = 'p';
    request(app)
      .patch(`/clients/setAccount`)
      .send({
        password,
        user_id: clients[0]._id
      })
      .expect(200)
      .expect((res) => {

        expect(res.body.status).toBe(400);
        expect(res.body.e).toExist();
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }
        done();
      });
  });
});

describe('POST /photos/:project/:folder', () => {
  it('should create a new photo', (done) => {
    var id = 'framedrive-test/boss.png/1509487302562743';
    var name = 'boss.png';
    var bucket = 'framedrive-test';
    var size = 947;
    var selfLink = 'https://www.googleapis.com/storage/v1/b/framedrive-test/o/boss.png';
    var mediaLink = 'https://www.googleapis.com/download/storage/v1/b/framedrive-test/o/boss.png?generation=1509487302562743&alt=media';
    request(app)
      .post(`/photos/${projects[0]._id.toHexString()}/${projects[0].folders[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        id,
        name,
        bucket,
        size,
        selfLink,
        mediaLink
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.photo.id).toEqual(id);
        expect(res.body.photo.name).toEqual(name);
        expect(res.body.photo.bucket).toEqual(bucket);
        expect(res.body.photo.selfLink).toEqual(selfLink);
        expect(res.body.photo.mediaLink).toEqual(mediaLink);
        expect(res.body.photo.type).toEqual('photo');
        expect(res.body.photo.folder).toEqual(projects[0].folders[0]._id.toHexString());
        expect(res.body.photo._createdAt).toExist();
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }
        done();
      });
  });
  it('should not create photo with invalid body data', (done) => {
    request(app)
      .post(`/photos/${projects[0]._id.toHexString()}/${projects[0].folders[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        id: 'abacaxi'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(404);
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.e);
          return done(err);
        }
        done();
      });
  });
});