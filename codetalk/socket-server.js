'use strict';
var socketIO = require('socket.io');
var ot = require('ot');
var ObjectId = require('mongodb').ObjectID;
var roomList = {};
var Task=require('./models/task');

var mongoUtil = require( './lib/mongoUtil' );


module.exports =  function(server) {
  mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  var db = mongoUtil.getDb();
  var cl2=db.collection( 'Task' );
console.log("was here");
  var str = 'This is a Markdown heading \n\n' +
            'var i = i + 1;';

  var io = socketIO(server);
  io.on('connection', function(socket) {
    socket.on('joinRoom', function(data) {
      if (!roomList[data.room]) {
        var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket, cb) {
          var self = this;
          var o_id = new ObjectId(data.room);
          // console.log("kya baat h "+ self.document,o_id);
          cl2.findOneAndUpdate({ _id : o_id} , {$set : {content: self.document}}, function(err) {
            if (err) {console.log(err);
              return cb(false);}
            cb(true);
          });

        });
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on('chatMessage', function(data) {
      io.to(socket.room).emit('chatMessage', data);
    });

    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  })
})
}
