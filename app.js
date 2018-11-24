var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var UserDB = require('./databases/UserDB');
var bodyParser = require('body-parser');
var promise = require('express-promise');
var Promise = require('promise');
// var sqlinjection = require('sql-injection');

/*----require routers-----------*/
var usersRouter = require('./routes/user');
var projectRouter = require('./routes/project');
/*------------------------------*/

var app = express();
var server = app.listen(8080, '0.0.0.0');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(sqlinjection);
app.use(express.static(path.join(__dirname, 'public')));
app.use(promise());

app.use('/user', usersRouter);
app.use('/project', projectRouter);

function close (){
	server.close();
}

module.exports = app;
module.exports.close = close;