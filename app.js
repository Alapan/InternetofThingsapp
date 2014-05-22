var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var temperature = require('./routes/temperature');
var humidity= require('./routes/humidity');
//var luminosity=require('./public/luminosity');

var app = express();
//var socket=require('socket.io').listen(app);    // For socket.io communication

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Response to requests

app.use('/', routes);
app.use('/temperature',temperature);
app.use('/humidity',humidity);
app.use('/luminosity',luminosity);
//app.use('/luminosity',luminosity);

// add a listener for connection from client
//socket.on('connection', function(client){
//	client.on('message', function(event){
//		console.log("Received message from client".event);
//	});
	// listener for disconnection
//	client.on('disconnect',function(){
//		clearInterval(interval);
//		console.log("Server has disconnected!");
//	});	
//})


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(4000);

module.exports = app;
