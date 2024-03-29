const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const jwt = require('express-jwt');
const debug = require('debug')('surveyer:app');

const config = require('./config');

const app = express();

debug('Environment: %s', app.get('env'));

const mongoose = require('mongoose');
mongoose.connect(config.dbConnStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: app.get('env') !== 'production', // Enable autoIndex feature by NODE_ENV value
});

const errorHandler = require('./routes/errors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({secret: config.secret}).unless({path: ['/users/login', '/users/']}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
