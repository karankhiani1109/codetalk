var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var mongoUtil = require( './../lib/mongoUtil' );
var Task=require('./../models/task');
var router = express.Router();
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  var db = mongoUtil.getDb();
  var cl2=db.collection( 'Task' );



router.get('/createTask', function(req, res) {
  var newTask = new Task();
  console.log("req.user " +req.user);
  newTask.content="";
  // newTask.userid=req.user._id;
  // newTask.dateAdded=new Date();
  cl2.insertOne(newTask,function( err, data) {
    if (err) {
      console.log(err);
      res.render('error');
    } else {
      
      res.redirect('/task/' + newTask._id);
    }
  })
});

router.get('/task/:id', function(req, res) {
 
  if(req.user){
    console.log(req.params.id);
  var o_id = new ObjectId(req.params.id);
  if (req.params.id) {
    cl2.findOne({_id: o_id}, function(err, data) {
     
      if (err) {
        console.log(err);
        res.render('error');
      }

      if (data) {
        console.log(data)
        res.render('task', {content: data.content, roomId: data._id,user: req.user});
      } else {
        res.render('error');
      }
    })
  } else {
    res.render('error');
  }
}else{res.redirect('/login')}
});

});

module.exports = router;