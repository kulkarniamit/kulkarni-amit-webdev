var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport configuration
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET, //Store it in process.env.SESSION_SECRET
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require ("./test/app.js")(app);

// Our assignment server
// require("./assignment/app.js")(app);

// Our project server
require("./project/app.js")(app);

// Testing mongoose in class
require("./public/lectures/mongoose/movies")(app);

var port = process.env.PORT || 3000;

app.listen(port);