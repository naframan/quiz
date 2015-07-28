var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var session = require('express-session');

var app = express();

var tiempo = 120000;
var debug = 0;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Nafraquiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function(req, res, next) {
  if (req.session.user) {
    if (!req.session.cookie.expires) {
      req.session.cookie.expires =  new Date(Date.now() + tiempo);
      if (debug) console.log('COOKIE SETEADA');
    } else if (req.session.cookie.expires && req.session.cookie.expires >= Date.now()) {
      req.session.cookie.expires =  new Date(Date.now() + tiempo);
      if (debug) console.log('COOKIE INCREMENTADA');
    } else {  // Por aquí nunca pasa, al poner que expira se autodestruye, sesion incluida!
      if (debug) console.log('COOKIE DESTRUIDA');
      delete req.session.cookie.expires;
      delete req.session.user;
    }
  }
  next();
});

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
