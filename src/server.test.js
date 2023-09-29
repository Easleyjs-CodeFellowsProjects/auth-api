'use strict';

const supertest = require('supertest');
const server = require('./server')
const request = supertest(server.app);

// Basic server tests
describe('It should see if server is accessible',() => {
    test('Does server respond?', async () => {
        let response = await request.get('/');

        expect(response.status).toEqual(200);
        expect(response.body).toBeTruthy();
    })
})

describe('It returns 404 errors on bad URLs',() => {
    test('Is 404 error returned?', async () => {
        let response = await request.get('/someBadPath');
        console.log(response.body);        
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('PAGE NOT FOUND.');
    })
})
