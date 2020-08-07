var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var createError = require('http-errors');

const MongoClient = require( 'mongodb' ).MongoClient;
var passport = require('passport');
var session = require('express-session');
var config = require('./config');
var cookieSession = require('cookie-session')
require('./passport');
var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth');
var taskRoute = require('./routes/task');

global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
  cookieName: 'session',
   secret: 'anything',
  resave:false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//     console.log(res.locals.user);
//   }
//   next();
// });

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', taskRoute);
app.get('/hello',
  function(req, res) {
    console.log(req.user);
    res.render('index', { user: req.user });
  });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// Connection.connectToMongo()
// var myobj = { name: "gfdfds Inc", address: "df 37" };
// Connection.db.collection("User").insertOne(myobj, function(err, res) {
//   if (err) throw err;
//   console.log("1 document inserted");
// });
// var mongoUtil = require( './lib/mongoUtil' );

// mongoUtil.connectToServer( function( err, client ) {
//   if (err) console.log(err);
//   // start the rest of your app here
//   // var mongoUtil = require( 'mongoUtil' );
// var db = mongoUtil.getDb();

// db.collection( 'User' ).find();
// // console.log(db)

// });
// var database = mongoUtil.getDb();
// // console.log(db);

// // var myobj = { name: "gfdfds Inc", address: "df 37" };
// // Connection.db.collection("User").insertOne(myobj, function(err, res) {
// //   if (err) throw err;
// //   console.log("1 document inserted");
// console.log(database.collection('User').find());

module.exports = app;
