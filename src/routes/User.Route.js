const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const userController = controllers['UserController'];

router.get('/', userController.index);

module.exports = router;
