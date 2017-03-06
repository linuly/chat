var express = require('express');
var router = express.Router();
var db = require('../js/mongo');
var title = 'Chat Login';

router.get('/', function(req, res, next) {
  res.render('login', {title: title, error: ''});
});

router.post('/', function(req, res, next) {

  db.select('user', {user_name: req.body.userName, user_password: req.body.passWord}, {}, function (data) {
    if(data.length) {
      db.update('user', {status: 1}, {_id: data[0]._id});
      req.session.user = {id: data[0]._id, name: req.body.userName};

      res.redirect('/');
    } else {
      var err = '入力が正しくありません。';
      res.render('login', {title: title, error: err});
    }
  });

});

module.exports = router;
