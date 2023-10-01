'use strict';

const supertest = require('supertest');
const base64 = require('base-64');
const server = require('../server')
const { sequelize, users, food } = require('../models/index');
const request = supertest(server.app);

let jsonWebToken = "";

beforeAll(async () => {
    await sequelize.sync();
    const signupUser = {
        username: "josh",
        password: "password",
        role: "admin"
    };
    const b64_credentials = base64.encode(`${signupUser.username}:${signupUser.password}`);
    await request.post("/signup").send(signupUser);

    const signinResponse = await request.post("/signin")
    .set('Authorization', `Basic ${b64_credentials}`);
    jsonWebToken = signinResponse.body.user.token;
})

afterAll(async () => {
    await sequelize.drop();
})

// v2 API Route Tests
describe('v2 API CRUD Tests', () => {

    // GET /api/v2/:model returns a list of :model items.
    test('GET /api/v2/food', async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get('/api/v2/food')
        .set('Authorization',`Bearer ${jsonWebToken}`);

        expect(response.status).toEqual(200);
        expect(response.body[0].name).toBe(newFood.name)
        expect(response.body[0].calories).toBe(newFood.calories)
        expect(response.body[0].type).toBe(newFood.type)
    })

    // GET /api/v1/:model/ID returns a single item by ID.
    test("GET /api/v2/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get("/api/v2/food/" + newFood.id)
        .set('Authorization',`Bearer ${jsonWebToken}`);

        expect(response.status).toEqual(200);
        expect(response.body.id).toBe(2)
        expect(response.body.name).toBe(newFood.name)
        expect(response.body.calories).toBe(newFood.calories)
        expect(response.body.type).toBe(newFood.type)
    })

    // POST /api/v1/:model adds an item to the db and returns an object with the added item.
    test("POST /api/v2/food", async () => {
        const data = {
            name: "Banana",
            calories: 1000,
            type: "fruit"
        };

    
        let response = await request.post("/api/v2/food")
        .set('Authorization',`Bearer ${jsonWebToken}`)
        .send(data);

        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toBe(data.name)
        expect(response.body.calories).toBe(data.calories)
        expect(response.body.type).toBe(data.type)

        const someFruit = await food.model.findOne({ where: { "id": response.body.id }});
        expect(someFruit).toBeTruthy()
        expect(someFruit.name).toBe(data.name);
        expect(someFruit.calories).toBe(data.calories);
        expect(someFruit.type).toBe(data.type);
        
    })

    // PUT /api/v1/:model/ID returns a single, updated item by ID.
    test("PUT /api/v2/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })
    
        const data = {
            name: "Schmrockley",
            calories: 1,
            type: 'vegetable'
        }
    
        let response = await request.put("/api/v2/food/" + newFood.id)
        .set('Authorization',`Bearer ${jsonWebToken}`)
        .send(data);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toBe(data.name)
        expect(response.body.calories).toBe(data.calories)
        expect(response.body.type).toBe(data.type)

        const someVeg = await food.model.findOne({ where: { "id": response.body.id }});
        expect(someVeg).toBeTruthy()
        expect(someVeg.name).toBe(data.name);
        expect(someVeg.calories).toBe(data.calories);
        expect(someVeg.type).toBe(data.type);

    })

    // DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found.
    test("DELETE /api/v2/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })
    
        let response = await request.delete("/api/v2/food/" + newFood.id)
        .set('Authorization',`Bearer ${jsonWebToken}`);

        expect(response.status).toBe(200);
        expect(await food.model.findOne({ where: { id: newFood.id }})).toBeFalsy()
    })
})

// v1 API Route Tests
describe('v1 API CRUD Tests', () => {

    // GET /api/v1/:model returns a list of :model items.
    test('GET /api/v1/food', async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get('/api/v1/food');

        expect(response.status).toEqual(200);
        expect(response.body[0].name).toBe(newFood.name)
        expect(response.body[0].calories).toBe(newFood.calories)
        expect(response.body[0].type).toBe(newFood.type)
    })

    // GET /api/v1/:model/ID returns a single item by ID.
    test("GET /api/v1/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get("/api/v1/food/" + newFood.id);

        expect(response.status).toEqual(200);
        expect(response.body.id).toBe(7)
        expect(response.body.name).toBe(newFood.name)
        expect(response.body.calories).toBe(newFood.calories)
        expect(response.body.type).toBe(newFood.type)
    })

    // POST /api/v1/:model adds an item to the db and returns an object with the added item.
    test("POST /api/v1/food", async () => {
        const data = {
            name: "Banana",
            calories: 1000,
            type: "fruit"
        };

    
        let response = await request.post("/api/v1/food").send(data);

        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toBe(data.name)
        expect(response.body.calories).toBe(data.calories)
        expect(response.body.type).toBe(data.type)

        const someFruit = await food.model.findOne({ where: { "id": response.body.id }});
        expect(someFruit).toBeTruthy()
        expect(someFruit.name).toBe(data.name);
        expect(someFruit.calories).toBe(data.calories);
        expect(someFruit.type).toBe(data.type);
        
    })

    // PUT /api/v1/:model/ID returns a single, updated item by ID.
    test("PUT /api/v1/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })
    
        const data = {
            name: "Schmrockley",
            calories: 1,
            type: 'vegetable'
        }
    
        let response = await request.put("/api/v1/food/" + newFood.id).send(data);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeTruthy()
        expect(response.body.name).toBe(data.name)
        expect(response.body.calories).toBe(data.calories)
        expect(response.body.type).toBe(data.type)

        const someVeg = await food.model.findOne({ where: { "id": response.body.id }});
        expect(someVeg).toBeTruthy()
        expect(someVeg.name).toBe(data.name);
        expect(someVeg.calories).toBe(data.calories);
        expect(someVeg.type).toBe(data.type);

    })

    // DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found.
    test("DELETE /api/v1/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })
    
        let response = await request.delete("/api/v1/food/" + newFood.id)

        expect(response.status).toBe(200);
        expect(await food.model.findOne({ where: { id: newFood.id }})).toBeFalsy()
    })
})

// Auth Route Tests
describe('Auth Route Tests', () => {
    // POST /signup creates a new user and sends an object with the user and the token to the client.
    test('Creates a new user and returns their new token', async () => {
        const signupUser = {
            username: "someguy",
            password: "password",
            role: "admin"
        };
        let response = await request.post("/signup").send(signupUser);

        const { user } = response.body;
        expect(user).toBeTruthy()
        expect(user.token).toBeTruthy()

        const adminUser = await users.findOne({ where: { "username": signupUser.username }});
        expect(adminUser).toBeTruthy()
        expect(adminUser.username).toBe(signupUser.username);
    })

    // POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.

    test('A user can sign in with their credentials', async () => {
        const signupUser = {
            username: "someguy",
            password: "password",
            role: "admin"
        };
        const b64_credentials = base64.encode(`${signupUser.username}:${signupUser.password}`);
        await request.post("/signup").send(signupUser);
    
        let signinResponse = await request.post("/signin")
        .set('Authorization', `Basic ${b64_credentials}`);
        
        const { username, token } = signinResponse.body.user;
        expect(username).toBe(signupUser.username);
        expect(token).toBeTruthy();
    })
})