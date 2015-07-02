var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync('./config/localhost.key').toString();
var certificate = fs.readFileSync('./config/localhost.crt').toString();
var options = {
  key : privateKey
, cert : certificate
}
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
// Start server.
var port = process.env.PORT || 3000; // Used by Heroku and http on localhost
process.env['PORT'] = process.env.PORT || 4000; // Used by https on localhost

http.createServer(app).listen(port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// Run separate https server if on localhost
if (process.env.NODE_ENV != 'production') {
    https.createServer(options, app).listen(process.env.PORT, function () {
        console.log("Express server listening with https on port %d in %s mode", this.address().port, app.settings.env);
    });
};

if (process.env.NODE_ENV == 'production') {
    app.use(function (req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
        if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
            return res.redirect(301, 'https://' + req.host + req.url);
        } else {
            return next();
            }
    });
} else {
    app.use(function (req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
        if (!req.secure) {
            return res.redirect(301, 'https://' + req.host  + ":" + process.env.PORT + req.url);
        } else {
            return next();
            }
    });

};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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


module.exports = app;
