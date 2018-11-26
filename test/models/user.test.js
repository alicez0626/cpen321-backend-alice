const User = require('../../models/user');

jest.mock('../../databases/UserDB');
const db = require('../../databases/UserDB');
db.query = jest.fn();

jest.mock('../../databases/ProjectDB');
const ProjectDB = require('../../databases/ProjectDB');
ProjectDB.query = jest.fn();

describe('Testing models/user', () => {
	const user = {
		userId: 1,
		userEmail: "123@gmail.com"
	};
	const profile = {
		userGender: 1
	};

	var querySpy = jest.spyOn(db, 'query');
	
	describe('Testing getInfo', () => {
		test('Existing userEmail, should call db.query once', async () => {
			userDbReturn(1);

			await User.getInfo("123@gmail.com");
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userEmail, should call db.query once, throws err', async () => {
			userDbReturn(0);

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal err', async () => {
			userDbErr();

			await User.getInfo("123@gmail.com")
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing updateUser', () => {
		test('Valid userId, should call db.query', async () => {
			userDbAffectedRows(1);

			await User.updateUser(user);
			expect(querySpy).toHaveBeenCalled();
		});

		test('Invalid userId, should call db.query, throws error', async () => {
			userDbAffectedRows(0);

			const expectedError = "No such userId";

			await User.updateUser(user)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(querySpy).toHaveBeenCalled();
		})

		test('MySQL error, should call db.query, throws error', async () => {
			userDbErr();

			await User.updateUser(user)
			.catch( error => {
				expect(querySpy).toHaveBeenCalled();
			})
		})
	})

	describe('Testing createUser', () => {
		test('valid user and profile, should call db.query twice', async () => {
			userDbAffectedRows(1);
			userDbAffectedRows(1);

			await User.createUser(user, profile);
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('MySQL internal error, throws error', async () => {
			userDbErr();

			await User.createUser(user, profile)
			.catch ( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing deleteUser', () => {
		test('Existing userId, should call db.query twice', async () => {
			userDbAffectedRows(1);
			userDbAffectedRows(1);

			await User.deleteUser(1);
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('Non-existing userId, should call db.query once', async () => {
			userDbAffectedRows(0);

			const expectedError = "The user has been deleted.";

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('userId in user and profile does not match, should call db.query twice, throws error', async () => {
			userDbAffectedRows(1);
			userDbAffectedRows(0);

			const expectedError = "The user's profile has been deleted."

			await User.deleteUser(1)
			.catch( error => {
				expect(error).toBe(expectedError);
			})
			expect(db.query.mock.calls.length).toBe(2);
		})
		test('SQL internal error, throws error', async () => {
			userDbErr();

			await User.deleteUser(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing getProfile', () => {
		test('Exisiting userId, should call db.query once', async () => {
			userDbReturn(1);

			await User.getProfile(1);
			expect(db.query.mock.calls.length).toBe(1);
		})
		test('Non-existing userId, should call db.query once, throws error', async () => {
			userDbReturn(0);

			const expectedError = "The userId does not exist.";

			await User.getProfile(1)
			.catch( error => {
				expect(error).toBe(expectedError);
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
		test('SQL internal error, throws error', async () => {
			userDbErr();

			await User.getProfile(1)
			.catch( error => {
				expect(db.query.mock.calls.length).toBe(1);
			})
		})
	})

	describe('Testing modifyProfile', () => {
		test('Exisiting userId, should call db.query once', async () => {
			userDbAffectedRows(1);

			await User.modifyProfile(1, profile);
			expect(querySpy).toHaveBeenCalled();
		})
		test('Non-existing userId, throw err', async () => {
			userDbAffectedRows(0);

			await User.modifyProfile(1, profile)
			.catch(error => {
				expect(querySpy).toHaveBeenCalled();
			})
		})
		test('userDbErr', async () => {
			userDbErr();

			await User.modifyProfile(1, profile)
			.catch(error => {
				expect(error).toBe('userDbErr');
				expect(querySpy).toHaveBeenCalled();
			})
		})
	})

	describe('Testing getProjectId', () => {
		test('userId maps to projectId', async () => {
			projectDbReturn(1);

			await User.getProjectId(1)
			.then( (result) => {
				expect(result.length).toBe(1);
			})
		})
		test('userId has no mapping to projectId', async () => {
			projectDbReturn(0);

			await User.getProjectId(1)
			.then( (result) => {
				expect(result.length).toBe(0);
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await User.getProjectId(1)
			.catch( err => {
				expect(err).toBe('projectDbErr');
			})
		})
	})

	describe('Testing getInvitation', () => {
		test('userId has mapping to invitation', async () => {
			projectDbReturn(1);
			await User.getInvitation(1)
			.then( result => {
				expect(result.length).toBe(1);
			})
		})
		test('userId has no mapping to invitation', async () => {
			projectDbReturn(0);
			await User.getInvitation(1)
			.then( result => {
				expect(result.length).toBe(0);
			})
		})
		test('projectDbErr', async () => {
			projectDbErr();
			await User.getInvitation(1)
			.catch( error => {
				expect(error).toBe('projectDbErr');
			})
		})
	})

	describe('Testing emailExist', () => {
		test('Existing userEmail', async () => {
			userDbReturn(1);
			await User.emailExist('123@gmail.com')
			.catch( error => {
				expect(error).toBe('userEmail 123@gmail.com has been taken.');
			})
		})
		test('Non-existing userEmail', async () => {
			userDbReturn(0);
			await User.emailExist('123@gmail.com')
			expect(querySpy).toHaveBeenCalled();
		})
		test('userDbErr', async () => {
			userDbErr();
			await User.emailExist('')
			.catch( error => {
				expect(error).toBe('userDbErr');
			})
		})
	})

});

function userDbErr(){
	db.query.mockImplementationOnce( () => {
		return Promise.reject("userDbErr");
	});
}

function userDbAffectedRows(rows){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve({affectedRows: rows});
	});
}

function userDbReturn(numResult){
	db.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	});
}

function projectDbReturn(numResult){
	ProjectDB.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	})
}

function projectDbErr(){
	ProjectDB.query.mockImplementationOnce( () => {
		return Promise.reject("projectDbErr");
	});
}

afterEach( () => {
	db.query.mockReset();
	ProjectDB.query.mockReset();
});
