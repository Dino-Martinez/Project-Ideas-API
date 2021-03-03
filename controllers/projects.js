const jwt = require('jsonwebtoken');
const Project = require('../models/project');

module.exports = (app) => {
  app.get('/projects', (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }

    Project.find({})
      .lean()
      .then((projects) => {
        res.json(projects);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.post('/projects/create', (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const projectJson = req.query;
    const project = new Project(projectJson);

    project
      .save()
      .then((project) => {
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.post('/projects/update/:postId', (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }

    Project.findOneAndUpdate({ _id: req.params.postId }, req.query).then(() => {
      res.redirect('/');
    });
  });

  app.post('/projects/delete/:postId', (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    Project.findOneAndDelete({ _id: req.params.postId }).then(() => {
      res.redirect('/');
    });
  });
};
