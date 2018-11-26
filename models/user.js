var db = require('../databases/UserDB.js');
var ProjectDB = require('../databases/ProjectDB')

async function getInfo (email) {
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	
	await db.query(query)
	.then ( (result) => {
		if ( result.length == 0)
			throw "The username does not exists.";
		return result[0];
	})
	.catch( (err) => {
		throw err;
	})
};

async function updateUser (userId, userPwd) {
	var query = "UPDATE Users SET userPwd = '" + userPwd + "' WHERE userId = '" + userId + "'";

	var result = await db.query(query)
	.catch( (err) => {
		throw err;
	});

	if (!result.affectedRows)
		throw "No such userId";
};

async function createUser (user, profile) {
	var userColumns = Object.keys(user);
	var userValues = Object.values(user);
	userValues = addQuotation(userValues);
	var userQuery = "INSERT INTO Users (" + userColumns + ") VALUES (" + userValues + ");";

	var profileColumns = Object.keys(profile);
	var profileValues = Object.values(profile);
	profileValues = addQuotation(profileValues);
	var profileQuery = "INSERT INTO Profiles (" + profileColumns + ") VALUES (" + profileValues + ");";

	var userResult = await db.query(userQuery)
	.catch ( (err) => {
		throw err;
	})

	var profileResult = await db.query(profileQuery)
	.catch ( (err) => {
		throw err;
	})

	return userResult.insertId;
} // copy this to CPEN-321

async function deleteUser (userId) {
	var userQuery = "DELETE FROM Users WHERE userId = " + userId + ";";
	var profileQuery = "DELETE FROM Profiles WHERE userId = " + userId + ";";
	
	await db.query(userQuery)
	.then( async (result) => {
		if (!result.affectedRows)
		{
			throw "The user has been deleted."
		}
		return await db.query(profileQuery)
	})
	.then( (result) => {
		if (!result.affectedRows)
		{
			throw "The user's profile has been deleted."
		}
	})
	.catch( (err) => {
		throw err;
	})	
}

async function getProfile (userId) {
	var query = "SELECT * FROM Profiles WHERE userId = " + userId + "";

	var result = await db.query(query)
	.catch( (err) => {
		throw err;
	})
	
	if (result.length == 0){
		throw "The userId does not exist.";
	}
	return result[0];
}

async function modifyProfile (userId, profile){
	for (var x in profile){
		var query = "UPDATE Profiles SET " + x + " = '" + profile[x] + "' WHERE userId = '" + userId + "'";

		var result = await db.query(query)
		.catch( (err) => {
			throw err;
		})

		if (result.affectedRows == 0){
			throw "userId " + userId + " does not exist in Profiles";
		}
	}
}

// async function updateProfile

function addQuotation (values){
	var length = values.length;
	var withQuotation = "";

	for (var i = 0; i < length-1; i++){
		withQuotation += "'" + values[i] + "',";
	}

	withQuotation += "'" + values[length-1] + "'";
	return withQuotation;
}

async function getProjectId (userId){
	var query = "SELECT projectId FROM Projects WHERE projectOwnerId = '" + userId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	var projectId = [];
	for (var i = 0; i < result.length; i++){
		projectId.push(result[i].projectId);
	}

	return projectId;
}

async function getInvitation (userId){
	var query = "SELECT * FROM InviteList WHERE userId = '" + userId + "'";
	var result = await ProjectDB.query(query)
	.catch (error => {
		throw error;
	})

	var invitation = [];
	for (var i = 0; i < result.length; i++){
		invitation.push(result[i].userId);
	}

	return invitation;
}

async function emailExist (userEmail){
	var query = "SELECT userEmail from Users WHERE userEmail = '" + userEmail + "'";
	var result = await db.query(query)
	.catch(error => {
		throw error;
	})
	if (result.length != 0){
		throw "userEmail " + userEmail + " has been taken."
	}
}

module.exports = {
	updateUser,
	createUser,
	deleteUser,
	getProfile,
	getInfo,
	modifyProfile,
	getProjectId,
	getInvitation,
	emailExist
}
