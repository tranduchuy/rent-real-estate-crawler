const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('config');
const app = express();
var log4js = require('log4js');
log4js.configure('./config/log4js.json');

const controllers = require('./src/controllers');

var port = config.get('app').port;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', controllers['DemoController'].index);

// catch unsupported api
app.use(function (req, res, next) {
  next(new Error("Unsupported api"));
});

// error handler
app.use(function (err, req, res, next) {
  return res.json({
    status: 0,
    message: [
      err.stack
    ],
    data: {}
  });
});

app.listen(port, () => {
  console.log('Example app listening on port ', port);
});