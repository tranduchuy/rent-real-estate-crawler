const userRoutes = require('./User.Route');
const checkToken = require('../middlewares/checkToken');


module.exports = (app) => {
  app.use(checkToken);
  app.use('/users', userRoutes);
  
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
}