var httpMocks = require('node-mocks-http');
const request = require('supertest');
var app;

jest.mock('../databases/UserDB');

beforeAll( () => {
	app = require('../app.js');
})

describe('PUT /users', () => {
	test('Update userPwd with valid userId, return 200', async () => {
		await request(app)
		.put('/users')
		.send({userId : 1, userPwd : "123"})
		.expect(200)
	})
})

describe('GET /users/profile', () => {
	test('Get profile with valid userId, return 200 and profile', async () => {
		await request(app)
		.get('/users/profile?userId=1')
		.expect(200)
	})

	test('Get profile with invalid userId, return 400 and error', async () => {
		const err = new Error('The userId does not exist.');

		await request(app)
		.get('/users/profile?userId=1')
		.expect(400)
		.catch( error => {
			expect(error).toBe(err);
		})
	})
})

afterAll( () => {
	app.close();
})

