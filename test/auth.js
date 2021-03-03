const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

const User = require('../models/user');

describe('Auth Testing', () => {
  it('Should not be able to login if the user has not signed up', (done) => {
    agent.post('/login', { username: 'incorrect', password: 'nope' }).end((err, res) => {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('Should be able to signup', (done) => {
    User.findOneAndRemove({ username: 'dino' }, () => {
      agent
        .post('/sign-up')
        .send({ username: 'dino', password: 'beast' })
        .end((err, res) => {
          res.should.have.status(200);
          agent.should.have.cookie('user_token');
          done();
        });
    });
  });

  it('Should be able to login if the user has signed up', (done) => {
    agent
      .post('/login')
      .send({ username: 'dino', password: 'beast' })
      .end((err, res) => {
        res.should.have.status(200);
        agent.should.have.cookie('user_token');
        done();
      });
  });

  it('Should be able to logout', (done) => {
    agent.get('/logout').end((err, res) => {
      res.should.have.status(200);
      agent.should.not.have.cookie('user_token');
      done();
    });
  });
});

after(() => {
  // clear users to not clutter db
  User.deleteMany({ username: { $ne: '' } }).then(() => {
    agent.close();
  });
});
