# Auth+RBAC API Server

API Server with CRUD db routes secured by bearer auth and RBAC ACLs

## Install instructions:

npm i express cors dotenv jest supertest sequelize pg sqlite3 eslint

## Render.com URL:
https://auth-api-rkxj.onrender.com/

## Assignment instructions

### Task 1/Feature: Combine api-server and auth-server code into a single server.
#### This will become the "/v1" router. It will have the following four routes:
- **POST** /signup to create a user.
- **POST** /signin to login a user and receive a token.
- **GET** /secret should require a valid bearer token.
- **GET** /users should require a valid token and “delete” permissions.

### Task 2/Feature: Creation of "protected" API routes.
#### This will become the "/v2" router. It will also have the following four routes:
- app.get(...) should require authentication only, no specific roles.
- app.post(...) should require both a **bearer token** token and the **create** capability.
- app.put(...) should require both a **bearer token** token and the **update** capability.
- app.delete(...) should require both a **bearer token** and the **delete** capability.


### Access Control List (ACL) Role Definitions:
- Regular users can READ.
- Writers can READ and CREATE.
- Editors can READ, CREATE, and UPDATE.
- Administrators can READ, CREATE, UPDATE, and DELETE.

**Note:** Routes that end up performing those actions in our API/Database need to be protected by both a valid user and that user’s permissions.

### Task 3/Feature: Code Cleanup and Unit and End-to-End tests.
#### Cleanup
- Change any .then() to async/await
- Properly catch errors and display to the console

#### Tests
**V1 (Unauthenticated API) routes:**
- POST /api/v1/:model adds an item to the DB and returns an object with the added item.
- GET /api/v1/:model returns a list of :model items.
- GET /api/v1/:model/ID returns a single item by ID.
- PUT /api/v1/:model/ID returns a single, updated item by ID.
- DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found.

**AUTH Routes:**
- POST /signup creates a new user and sends an object with the user and the token to the client.
- POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.

**V2 (Authenticated API) routes:**
- POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item.
- GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items.
- GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID.
- PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID.
- DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found.