var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var userController = require('../controllers/userController');
//const {check, validationResult} = require('express-validator/check');
var validator = require('../middlewares/validation');

router.put('/', 
	userController.userUpdate);

router.post('/',
	(req, res, next) => { 
		/* since the validator cannot find userEmail in body, we 
		need to put all json into req.param for the validator to check*/
		Object.assign(req.params, req.body.profile, req.body.user);
		next();
	}, 
	validator.checkParams,
	userController.userCreate);

router.delete('/', 
	userController.userDelete);

router.get('/profile',
	userController.profileGet);

router.put('/profile',
	userController.profileUpdate);

module.exports = router;
