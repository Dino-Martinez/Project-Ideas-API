const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app) => {
  app.get('/', (req, res) => {
    let response = 'Hello';
    if (req.user) {
      response += req.user.username;
    }
    res.send(response);
  });

  app.post('/sign-up', (req, res) => {
    // Create User
    const user = new User(req.body);

    user
      .save()
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: '60 days',
        });
        res.cookie('user_token', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Find this user name
    User.findOne({ username }, 'username password')
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send({ message: 'Wrong username or password' });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: 'Wrong username or password' });
          }

          // Create a token
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: '60 days',
          });
          // Set a cookie and redirect to root
          res.cookie('user_token', token, { maxAge: 900000, httpOnly: true });
          res.redirect('/');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('user_token');
    res.redirect('/');
  });
};
