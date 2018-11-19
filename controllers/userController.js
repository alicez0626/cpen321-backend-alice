var User = require('../models/user.js');
const {validationResult} = require('express-validator/check');

/* /users */
async function userInfoGet (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user email."});
	}

	var info;

	try{ 
		let info = await User.get_info(req.param('userEmail'));
		return res.status(200).json(info);
	} catch (error) {
		return res.status(404).json({error});
	}
};

async function userUpdate (req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user info."});
	}

	try {
		await User.updateUser(req.body);
		return res.status(200).json();
	} catch (error) {
		return res.status(400).json({error});
	}
};

async function userCreate (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()){ 
		return res.status(400).json({"error": "Invalid user info."});
	}

	try{
		await User.createUser(req.body.user, req.body.profile);
		return res.status(200).json();
	} catch (error) {
		return res.status(400).json({ error });
	}
};

async function userDelete (req, res) {
	try {
		await User.deleteUser(req.body.userId);
		return res.status(200).end();
	} catch (error) {
		return res.status(400).json({error});
	}
}

/*----------------------*/
/*----/users/profiles---*/
async function profileGet (req, res) {
	var profile;

	try {
		profile = await User.getProfile(req.param('userId'));
		return res.status(200).json({profile});
	} catch (error) {
		return res.status(400).json({error});
	}
}

async function profileUpdate (req, res) {
	try {
		await User.updateProfile(req.body);
		return res.status(200).end();
	} catch (error) {
		return res.status(400).json({error});
	}
}

module.exports = {
	userInfoGet,
	userUpdate,
	userCreate,
	userDelete,
	profileGet,
	profileUpdate
}