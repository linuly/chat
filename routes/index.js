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

  var params = req.query;
console.log(req.query);
console.log(req.method);
  if (params.content) {
    console.log('content in');
  }

  db.join('room_member', "room", "room_id", "_id", "room", {user_id: userId}, function (roomList) {
    if (roomList.length) {
      db.join('chat_log', 'chat_read', '_id', 'chat_id', 'chat_read', {room_id: roomList[0].room_id}, function (dashboard) {
        res.render('index', { title: title, user: user, roomList: roomList, dashboard: dashboard });
      });
    } else {
      res.render('index', { title: title, user: user, roomList: null, dashboard: null });
    }
  });
});

router.get('/room', function(req, res) {
  res.writeHead(200, {
    'Content-Type' : 'text/plain',
    'Access-Control-Allow-Origin' : '*'
  });

  if (req.query.name) {
    var date = new Date();
    db.insert('room', {room_name: req.query.name, update_date: date}, function (id) {
      db.insert('room_member', {room_id: bson.ObjectId(id), user_id: bson.ObjectId(req.session.user.id)}, function (member){
        res.write('\'' + id + '\'', 'utf8');
        res.end();
      });
    });
  } else {
    res.write("'false'", 'utf8');
    res.end();
  }

});

router.get('/member', function(req, res) {
  res.writeHead(200, {
    'Content-Type' : 'text/plain',
    'Access-Control-Allow-Origin' : '*'
  });

  if (req.query.name && req.query.room) {
    db.select('user', {user_name: req.query.name}, {}, function (user) {
      if (user.length) {
        db.select('room_member', {user_id: user[0]._id, room_id: bson.ObjectId(req.query.room)}, {}, function (member) {
          if (!member.length) {
            db.insert('room_member', {user_id: user[0]._id, room_id: bson.ObjectId(req.query.room)}, function (id) {
              res.write('true', 'utf8');
              res.end();
            });
          } else {
            res.write('既にメンバーに登録されています', 'utf8');
            res.end();
          }
        });
      } else {
        res.write(req.query.name + ' は見つかりませんでした', 'utf8');
        res.end();
      }
    });
  } else {
    res.write('エラーが発生しました', 'utf8');
    res.end();
  }

});

router.get('/select', function(req, res) {
  res.writeHead(200, {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*'
  });

  if (req.query.room) {
    db.join('room', "chat_log", "_id", "room_id", "chat_log", {_id: bson.ObjectId(req.query.room)}, function (roominfo) {
      res.end(JSON.stringify(roominfo[0]));
    });
  } else {
    res.write("'false'", 'utf8');
    res.end();
  }

});

module.exports = router;
