var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var userController = require('../controllers/userController');
//const {check, validationResult} = require('express-validator/check');
var validator = require('../middlewares/validation');

router.put('/', 
	userController.userUpdate);

router.post('/signup',
	userController.userCreate);

router.delete('/', 
	userController.userDelete);

router.get('/profile',
	userController.profileGet);

router.put('/profile',
	userController.profileUpdate);

module.exports = router;
