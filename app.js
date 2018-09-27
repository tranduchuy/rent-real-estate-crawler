require('./config/crawler');
require('./config/selector');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('config');
const app = express();
const dbConnect = require('./config/db');
var log4js = require('log4js');
log4js.configure('./config/log4js.json');



var port = config.get('app').port;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./src/routes/index')(app);

// dbConnect(() => {
//   app.listen(port, () => {
//     console.log('Example app listening on port ', port);
//   });
  
  require('./src/services/crawler')();
// });