require('./config/crawler');
require('./config/selector');
const express = require('express');
var http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('config');
const app = express();
var log4js = require('log4js');
log4js.configure('./config/log4js.json');


var port = config.get('app').port;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./src/routes/index')(app);

app.set('port', port);

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.on('listening', onListening);


require('./src/services/crawler')();

function onListening() {
    console.log('Server is running on port ', port);
}