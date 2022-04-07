const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const auth = require('./Helpers/jwt.js')
const unless = require('express-unless')
const users = require('./Controllers/UsersController.js')
const errors = require('./Helpers/ErrorHandler.js')

require('dotenv').config()

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/users/login', methods: ['POST'] },
        { url: '/users/register', methods: ['POST'] }
    ]
}))

app.use(express.json()); // middleware for parsing application/json
app.use('/users', users); // middleware for listening to routes
app.use(errors.errorHandler); // middleware for error reponses

// MongoDB connection, success & error event responses
const uri = "";
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo at ${uri}`));

app.listen(3002);