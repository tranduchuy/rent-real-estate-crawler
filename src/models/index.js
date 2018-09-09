const log4js = require('log4js');
const logger = log4js.getLogger('Models');

module.exports = require('require-all')({
  dirname: __dirname,
  filter: /(.+Model)\.js$/,
  resolve: function (Model) {
    return new Model(logger);
  },
  map: (name) => {
    return name.replace('.', '');
  }
});