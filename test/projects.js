const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

const User = require('../models/user');
const Project = require('../models/project');

const PROJECT_ID = '5d6ede6a0ba62570afcedd3a';

// Auth will be tested before projects, so these routes are good
before((done) => {
  agent
    .post('/sign-up')
    .send({ username: 'dino', password: 'beast' })
    .then((res) => agent.get('/logout'))
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

const login = () => {
  console.log('Logging in...');
  return agent.post('/login').send({ username: 'dino', password: 'beast' });
};

describe('API Endpoint Testing', () => {
  const project = {
    _id: PROJECT_ID,
    name: 'Cool Project',
    description: 'This project is cool',
  };

  it('Should test that Create does not work when logged out', (done) => {
    agent.post('/projects/create', project).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Read does not work when logged out', (done) => {
    agent.get('/projects').end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Update does not work when logged out', (done) => {
    agent.post(`/projects/update/${PROJECT_ID}`, project).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Delete does not work when logged out', (done) => {
    agent.post(`/projects/delete/${PROJECT_ID}`).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Create works when logged in', (done) => {
    login().end((err, res) => {
      if (err) console.log(err);
      Project.estimatedDocumentCount().then((previousDocCount) => {
        agent
          .post(
            `/projects/create?_id=${project._id}&name=${project.name}&description=${project.description}`
          )
          .then((res) => {
            res.status.should.be.equal(200);
            Project.estimatedDocumentCount().then((newDocCount) => {
              newDocCount.should.be.equal(previousDocCount + 1);
              done();
            });
          });
      });
    });
  });

  it('Should test that Read works when logged in', (done) => {
    // Create has been tested already
    agent.get('/projects').then((res) => {
      done();
    });
  });

  it('Should test that Update works when logged in', (done) => {
    const newProject = {
      name: 'New name',
      description: 'New description',
    };
    // Create has been tested already
    agent
      .post(
        `/projects/update/${PROJECT_ID}?name=${newProject.name}&description=${newProject.description}`
      )
      .then((res) => {
        Project.findById(PROJECT_ID).then((project) => {
          project.name.should.equal('New name');
          project.description.should.equal('New description');
          done();
        });
      });
  });

  it('Should test that Delete works when logged in', (done) => {
    // Create has been tested already
    Project.estimatedDocumentCount().then((previousDocCount) => {
      agent.post(`/projects/delete/${PROJECT_ID}`).then((res) => {
        res.status.should.be.equal(200);
        Project.estimatedDocumentCount().then((newDocCount) => {
          newDocCount.should.be.equal(previousDocCount - 1);
          done();
        });
      });
    });
  });
});

after(() => {
  // clear users to not clutter db
  User.deleteMany({ username: { $ne: '' } })
    .then(() => Project.deleteMany({ name: { $ne: '' } }))
    .then(() => {
      agent.close();
    });
});
