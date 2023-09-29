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

    jsonWebToken = signinResponse.token;
})

afterAll(async () => {
    await sequelize.drop();
})

// v2 API Route Tests
describe('v2 API CRUD Tests', () => {

    // GET /api/v1/:model returns a list of :model items.
    test('GET /api/v2/food', async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get('/api/v2/food');

        expect(response.status).toEqual(200);
        expect(response.body[0].id).toBe(1)
        expect(response.body[0].name).toBe(newFood.name)
        expect(response.body[0].calories).toBe(newFood.calories)
        expect(response.body[0].type).toBe(newFood.type)
    })

    // GET /api/v1/:model/ID returns a single item by ID.
    xtest("GET /api/v2/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })

        let response = await request.get("/api/v2/food/" + newFood.id);
        //console.log("reponse:",response.body)
        expect(response.status).toEqual(200);
        expect(response.body.id).toBe(1)
        expect(response.body.name).toBe(newFood.name)
        expect(response.body.calories).toBe(newFood.calories)
        expect(response.body.type).toBe(newFood.type)
    })

    // POST /api/v1/:model adds an item to the db and returns an object with the added item.
    xtest("POST /api/v2/food", async () => {
        const data = {
            name: "Banana",
            calories: 1000,
            type: "fruit"
        };

    
        let response = await request.post("/api/v2/food").send(data);

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
    xtest("PUT /api/v2/food/:id", async () => {
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
    
        let response = await request.put("/api/v2/food/" + newFood.id).send(data);

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
    xtest("DELETE /api/v2/food/:id", async () => {
        let newFood = await food.create({
            name: "Broccoli",
            calories: 0,
            type: "vegetable"
        })
    
        let response = await request.delete("/api/v2/food/" + newFood.id)

        expect(response.status).toBe(200);
        expect(await food.model.findOne({ where: { id: newFood.id }})).toBeFalsy()
    })
})