const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');

module.exports = require('require-all')({
  dirname: __dirname,
  filter: /(.+Controller)\.js$/,
  resolve: function (Controller) {
    return new Controller(logger);
  },
  map: (name) => {
    return name.replace('.', '');
  }
});