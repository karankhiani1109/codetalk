var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoUtil = require( './../lib/mongoUtil' );
var User=require('./../models/user');
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
  // var mongoUtil = require( 'mongoUtil' );
var db = mongoUtil.getDb();
var cl1=db.collection( 'User' );
router.route('/login')
  .get(function(req, res, next) {
    
    res.render('login', { title: 'Login your account'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login'
  }), function (req, res,next) {
    // console.log(req.body);
    // return next()
    res.redirect('/');
  
  });

router.route('/register')
  .get(function(req, res, next) {
    res.render('register', { title: 'Register a new account'});
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();
    console.log(req.body);
    var errors = req.validationErrors();
    flag=0;
    if (errors) {
      res.render('register', {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    } else {
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);
    //   console.log(db.user)
    cl1.insertOne(user, function(req, res, err) {
        if (err) {
                  res.render('register', {errorMessages: err});
                } else {
                  console.log("here2")
                  flag=1;
                  res.redirect('/login');
                }
            });
            // db.close();
            console.log("here3",flag)
    //   user.save(function (err) {
    //     if (err) {
    //       res.render('register', {errorMessages: err});
    //     } else {
    //       res.redirect('/login');
    //     }
    //   })
    }
    console.log("here1",flag)
    if (flag == 1){
      console.log("here")
      res.redirect('/');
    }
  });

  router.get('/login/current_user', function(req, res) {
    
    console.log(req.user);
    
    res.render('index', { title: 'test' });
  });


router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// router.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/'
// }));

// console.log(db)

} );
// var d
module.exports = router;



