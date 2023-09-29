'use strict';

const supertest = require('supertest');
const base64 = require('base-64');
const server = require('../server')
const { sequelize, users } = require('../models/index');
const request = supertest(server.app);

beforeEach(async () => {
    await sequelize.sync();
})

afterEach(async () => {
    await sequelize.drop();
})

// Auth Route Tests
describe('Auth Route Tests', () => {
    // POST /signup creates a new user and sends an object with the user and the token to the client.
    test('Creates a new user and returns their new token', async () => {
        const signupUser = {
            username: "josh",
            password: "password",
            role: "admin"
        };
        let response = await request.post("/signup").send(signupUser);

        const { user } = response.body;
        expect(user).toBeTruthy()
        expect(user.token).toBeTruthy()
        //console.log(user);

        const adminUser = await users.findOne({ where: { "username": signupUser.username }});
        //console.log(adminUser);
        expect(adminUser).toBeTruthy()
        expect(adminUser.username).toBe(signupUser.username);
    })

    // POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.

    test('A user can sign in with their credentials', async () => {
        const signupUser = {
            username: "josh",
            password: "password",
            role: "admin"
        };
        const b64_credentials = base64.encode(`${signupUser.username}:${signupUser.password}`);
        await request.post("/signup").send(signupUser);
    
        let signinResponse = await request.post("/signin")
        .set('Authorization', `Basic ${b64_credentials}`);

        const { signedInUser } = signinResponse.user;
        expect(signedInUser.username).toBe(signupUser.username);
        expect(signedInUser.token).toBeTruthy();
    })
})