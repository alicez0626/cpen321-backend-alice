var db = require('../databases/UserDB.js');
//var profile_db = require('../databases/ProfileDB')

async function getInfo (email) {
	var query = "SELECT * FROM Users WHERE userEmail = '" + email + "'";
	
	await db.query(query)
	.then ( (result) => {
		if ( result.length == 0)
			throw "User name does not refer to any entry.";
		return result[0];
	})
	.catch( (err) => {
		throw err;
	})
};

async function updateUser (user) {
	for (var x in user){
		if (x !== 'userId'){
			var query = "UPDATE Users SET " + x + " = '" + user[x] + "' WHERE userId = '" + user.userId + "'";
			
			await db.query(query)
			.then( (result) => {
				if (!result.affectedRows)
					throw "No such userId";
			})
			.catch( (err) => {
				throw err;
			})
		}
	}
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

	await db.query(userQuery)
	.then ( async (result) => {
		await db.query(profileQuery)
	})
	.catch ( (err) => {
		throw err;
	})
 }

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

module.exports = {
	updateUser,
	createUser,
	deleteUser,
	getProfile
}
