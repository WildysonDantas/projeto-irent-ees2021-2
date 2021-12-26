require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const mongooseConnection = require('./config/mongooseConnection.config');
const index = require('./routes/index');

const app = express();

app.use(credentials);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(morgan('common'));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(errorHandler);
app.set('mongoose connection', mongooseConnection);
app.use(index);

module.exports = app;
