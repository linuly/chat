var express = require('express');
var bson = require('bson');
var router = express.Router();
var db = require('../js/mongo');
var title = 'Chat';

require('../js/mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.session.user;
  var userId = bson.ObjectId(req.session.user.id);

  db.join('room_member', "room", "room_id", "_id", "room", {user_id: userId}, function (roomList) {
  // db.select('room_member', {user_id: userId}, {}, function (rooms) {
    db.join('chat_log', 'chat_read', '_id', 'chat_id', 'chat_read', {room_id: roomList[0].room_id}, function (dashboard) {
    // db.select('chat_log', {room_id: roomList[0]._id}, {}, function (dashboard) {
      res.render('index', { title: title, user: user, roomList: roomList, dashboard: dashboard });
    });
  });
});

module.exports = router;
