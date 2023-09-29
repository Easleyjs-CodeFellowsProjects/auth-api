'use strict';

const supertest = require('supertest');
const server = require('./server')
const { sequelize, food } = require('./models/index');
const request = supertest(server.app);

beforeEach(async () => {
    await sequelize.sync();
})

afterEach(async () => {
    await sequelize.drop();
})

// Basic server tests
xdescribe('It should see if server is accessible',() => {
    test('Does server respond?', async () => {
        let response = await request.get('/');

        expect(response.status).toEqual(200);
        expect(response.body).toBeTruthy();
    })
})

xdescribe('It returns 404 errors on bad URLs',() => {
    test('Is 404 error returned?', async () => {
        let response = await request.get('/someBadPath');
        console.log(response.body);        
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('PAGE NOT FOUND.');
    })
})

xdescribe('It returns on bad/unavailable methods on routes', () => {
    test('Is 500 status returned on bad method request?', async () => {
        let response = await request.post('/');
        console.log(response.body);

        expect(response.status).toEqual(500);
    })
})

// Auth Route Tests
describe('Auth Route Tests', () => {
    // POST /signup creates a new user and sends an object with the user and the token to the client.
    test('Creates a new user and returns their new token', () => {

    })

    // POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.
    test('A user can sign in with their credentials', () => {

    })

    // POST /signin with bearer authentication headers logs in a user and sends an object with the user and the token to the client.
    test('A user can sign in with their a token', () => {

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
        expect(response.body[0].id).toBe(1)
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
        //console.log("reponse:",response.body)
        expect(response.status).toEqual(200);
        expect(response.body.id).toBe(1)
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

