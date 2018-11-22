var httpMocks = require('node-mocks-http');
const request = require('supertest');
var app;

jest.mock('../databases/UserDB');
const db = require('../databases/UserDB');
db.query = jest.fn();

var router = require('../routes/users');
//var routerSpy = jest.spyOn(router, 'put');

beforeAll( () => {
	app = require('../app.js');
})

describe('Testing PUT /users', () => {
	test('Exisiting userId, return 200', async () => {
		sqlAffectedRows(1);
		await request(app)
		.put('/users')
		.send({userId : 1, userPwd : "123"})
		.expect(200)
	})
	test('Non-existing userId, return 400', async () => {
		sqlAffectedRows(0);
		await request(app)
		.put('/users')
		.send({userId : 1, userPwd : "123"})
		.expect(400)
	})
	test('sql internal err', async () => {
		sqlInternalErr();
		await request(app)
		.put('/users')
		.send({userId : 1, userPwd : "123"})
		.expect(400)
	})
})

describe('GET /users/profile', () => {
	test('Get profile with valid userId, return 200 and profile', async () => {
		sqlReturn(1);
		await request(app)
		.get('/users/profile?userId=1')
		.expect(200)
	})

	test('Get profile with invalid userId, return 400 and error', async () => {
		const err = new Error('The userId does not exist.');
		sqlReturn(0);
		await request(app)
		.get('/users/profile?userId=1')
		.expect(400)
		.catch( error => {
			expect(error).toBe(err);
		})
	})
})

function sqlInternalErr(){
	db.query.mockImplementationOnce( () => {
		return Promise.reject();
	});
}

function sqlAffectedRows(rows){
	db.query.mockImplementationOnce( () => {
		return Promise.resolve({affectedRows: rows});
	});
}

function sqlReturn(numResult){
	db.query.mockImplementationOnce( () => {
		if (numResult == 0){
			return Promise.resolve([]);
		} else {
			return Promise.resolve([{result: "Some results"}]);
		}
	});
}

afterEach( () => {
	db.query.mockReset();
});


afterAll( () => {
	app.close();
})

