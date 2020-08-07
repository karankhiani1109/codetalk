var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  content: String,
  userid : String,
  dateAdded: Date
});

module.exports = mongoose.model('Task', taskSchema);
