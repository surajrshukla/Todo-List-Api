const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const fs = require("fs");
const cors = require('cors');

const currentPath = path.resolve();
const basePath = currentPath + '/.env';
const envPath = basePath + '.' + process.env.NODE_ENV;
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

const dotenv = require('dotenv');
const fileEnv = dotenv.config({ path: finalPath });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({ origin: true, credentials: true }));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access_token, authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const bucket_service = require('./routes/bucket_service');
app.use('/bucket_service', bucket_service);

const todo_service = require('./routes/todo_service');
app.use('/todo_service', todo_service);


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
