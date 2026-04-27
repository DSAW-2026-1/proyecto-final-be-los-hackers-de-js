var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const loginRouter = require('./routes/auth/login');
const adminLoginRouter = require('./routes/auth/admin/login');
const registerRouter = require('./routes/auth/register');
const tokenValidatorMiddleware = require('./middleware/auth/tokenValidator');
const userAuthMiddleware = require('./middleware/auth/userValidator')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);

//app.use('/users', tokenValidatorMiddleware);
//app.use('/users', userAuthMiddleware);
//app.use('/users', usersRouter);

app.use('/api/auth/login', loginRouter);
app.use('/api/auth/register', registerRouter);
app.use('/api/admin/login', adminLoginRouter);

module.exports = app;
