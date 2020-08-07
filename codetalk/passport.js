var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoUtil = require( './lib/mongoUtil' );
var User=require('./models/user');

var user1 = new User();
mongoUtil.connectToServer( function( err, client ) {
    if (err) console.log(err);
    // start the rest of your app here
    // var mongoUtil = require( 'mongoUtil' );
  var db = mongoUtil.getDb();
  var cl1=db.collection( 'User' );
  passport.serializeUser(function (user, cb) {
    // console.log("serialize",user._id)
    cb(null, user._id);
  });
  
  passport.deserializeUser(function (id, cb) {
    // console.log("deseralize",id)
    var o_id = new ObjectId(id);
    // console.log("sdf",cl1.findOne({ _id : o_id}));
    cl1.findOne({ _id : o_id}, function (err, user) {
      if (err) { return cb(err);
      console.log(err); }
      // console.log(user)
      cb(err, user);
    })
  });

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function (username, password, cb) {
    console.log(cl1.findOne({email: username}));
    
    cl1.findOne({email: username}, function (err, user) {
      if (err) return cb(err);
      
      
      if (!user) {
        return cb(null, false, {
          message: 'Incorrect username or password'
        });
      }
      
      if (!user1.validPassword(password,user.salt,user.hash)) {
        return cb(null, false, {
          message: 'Incorrect username or password'
        });
      }
      console.log(user)
      return cb(null, user);
    })
  }
));


// passport.use(new FacebookStrategy({
//     clientID: '612822675590167',
//     clientSecret: 'dcb63fc3264a53bc54496cad1ab51da6',
//     callbackURL: 'https://salty-bayou-80249.herokuapp.com/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'email']
//   },
//   function(token, refreshToken, profile, done) {
//     User.findOne({'facebookId': profile.id}, function(err, user) {
//       if (err) return done(err);

//       if (user) {
//         return done(null, user);
//       } else {
//         User.findOne({email: profile.emails[0].value}, function (err, user) {
//           if (user) {
//             user.facebookId = profile.id
//             return user.save(function (err) {
//               if (err) return done(null, false, { message: "Can't save user info"});
//               return done(null, user);
//             })
//           }

//           var user = new User();
//           user.name = profile.displayName;
//           user.email = profile.emails[0].value;
//           user.facebookId = profile.idea
//           user.save(function (err) {
//             if (err) return done(null, false, { message: "Can't save user info"});
//             return done(null, user);
//           });
//         })
//       }


//     });
//   }
// ));
});
