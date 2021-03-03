const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

const User = require('../models/user');

// Auth will be tested before projects, so these routes are good
before(() => {
  const username = 'dino';
  const password = 'beast';
  agent
    .post('/sign-up')
    .send({ username, password })
    .end((err, res) => {
      if (err) return err;
      return res;
    });
});

const login = (username, password) => {
  agent
    .post('/login')
    .send({ username: 'dino', password: 'beast' })
    .end((err, res) => {
      if (err) return err;
      return res;
    });
};

const project = {
  id: 123,
  name: 'Cool Project',
  description: 'This project is cool',
};

describe('API Endpoint Testing', () => {
  it('Should test that Create does not work when logged out', (done) => {
    agent.post('/projects/create', project).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Read does not work when logged out', (done) => {
    agent.post('/projects/1').end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Update does not work when logged out', (done) => {
    agent.post('/projects/update/123', project).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Delete does not work when logged out', (done) => {
    agent.post('/projects/delete/123').end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should test that Create works when logged in', (done) => {
    login();
    Project.estimatedDocumentCount().then((previousDocCount) => {
      agent.post('/projects/create', project).then((res) => {
        res.status.should.be.equal(200);
        Project.estimatedDocumentCount().then((newDocCount) => {
          expect(newDocCount).to.be.equal(previousDocCount + 1);
        });
      });
    });
  });

  it('Should test that Read works when logged in', (done) => {
    login();
    // Create has been tested already
    agent.get('/projects').then((res) => {
      expect(res).to.not.be.empty;
      expect(res[0]).to.be({
        name: 'Cool Project',
        description: 'This project is cool',
      });
      done();
    });
  });

  it('Should test that Update works when logged in', (done) => {
    login();
    const newProject = {
      name: 'New name',
    };
    // Create has been tested already
    agent.post('/projects/update/123', newProject).then((res) => {
      expect(res).to.not.be.empty;
      expect(res).to.be({
        name: 'New name',
        description: 'This project is cool',
      });
      done();
    });
  });

  it('Should test that Delete works when logged in', (done) => {
    login();
    // Create has been tested already
    Project.estimatedDocumentCount().then((previousDocCount) => {
      agent.post('/projects/delete/123', project).then((res) => {
        res.status.should.be.equal(200);
        Project.estimatedDocumentCount().then((newDocCount) => {
          expect(newDocCount).to.be.equal(previousDocCount - 1);
        });
      });
    });
  });
});

after(() => {
  // clear users to not clutter db
  User.deleteMany({ username: { $ne: '' } }).then(() => {
    agent.close();
  });
});
