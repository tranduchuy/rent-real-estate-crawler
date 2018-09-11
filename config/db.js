const config = require('config');
const mongoose = require('mongoose');
const mongo = config.get('mongo');

let connectElements = [
  'mongodb://',
  mongo.user,
  ':',
  mongo.password,
  '@',
  mongo.host,
  ':',
  mongo.port,
  '/',
  mongo.dbdb
];

if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
  connectElements = [
    'mongodb://',
    mongo.host,
    ':',
    mongo.port,
    '/',
    mongo.dbdb
  ];
}

const connectionString = connectElements.join('');

const connnectDb = (callback) => {
  mongoose.connect(connectionString, (err) => {
    if (err) {
      return console.error('Cannot connect mongodb');
    }

    return callback();
  });
}

module.exports = connnectDb