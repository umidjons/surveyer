const express = require('express');
const router = express.Router();
const debug = require('debug')('surveyer:router:user');
const User = require('../models/user');
const ErrorHandler = require('./errors');

/* GET users listing. */
router
  .get('/', (req, res, next) => {
    res.send('respond with a resource');
  })
  .post('/login', async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const user = await User.findByUsername(username);
      if (!user) {
        return next('Invalid username or password');
      }

      if (await user.checkPassword(password)) {
        return res.json(user.toAuthJSON());
      }

      next('Invalid username or password');
    }
    catch (error) {
      next(error);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const user = await new User(req.body).save();
      return res.json({error: 'ok'});
    }
    catch (error) {
      next(error);
    }
  })
  .use(ErrorHandler);

module.exports = router;
