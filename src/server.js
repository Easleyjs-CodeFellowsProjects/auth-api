'use strict';

const express = require('express');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const authRoutes = require('./auth/routes.js'); // Auth routes (signin, signup)
const v1Routes = require('./routes/v1.js'); // Basic API Routes with no auth middleware
// v2Routes // API Routes with Auth and ACL

const app = express();

app.use(express.json());

app.use(logger);

app.get("/", (req, res, next) => {
  res.status(200).send("Root Path");
})

app.use(authRoutes);
app.use('/api/v1', v1Routes);

app.use('/*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
