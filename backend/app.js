const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/auth/login');
const adminLoginRouter = require('./routes/auth/admin/login');
const registerRouter = require('./routes/auth/register');
const tokenValidatorMiddleware = require('./middleware/auth/tokenValidator');
const userAuthMiddleware = require('./middleware/auth/userValidator')
const sellerAuthMiddleware = require("./middleware/auth/authVendedor")

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use()

//app.use('/', indexRouter);

app.use('/api/auth/login', loginRouter);
app.use('/api/auth/register', registerRouter);
app.use('/api/admin/login', adminLoginRouter);
app.use('/api/users', usersRouter);

module.exports = app;
