// src/server.js
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes');
const mongoose = require('mongoose');

const express = require('express');
const config = require('./config');

//connection to the database
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

const app = express();
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use('/api', router);


app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});
