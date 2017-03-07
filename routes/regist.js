var express = require('express');
var router = express.Router();
var db = require('../js/mongo');
var title = 'Chat Regist';

router.get('/', function(req, res, next) {
  res.render('regist', {title: title, error: ''});
});

router.post('/', function(req, res, next) {

  db.select('user', {user_name: req.body.userName, user_password: req.body.passWord}, {}, function (data) {
    if(data.length == 0) {
      if (req.body.passWord == req.body.rePassWord) {
        // ユーザ登録
        db.insert('user', {user_name: req.body.userName, user_password: req.body.passWord, status: 1}, function (user) {
          req.session.user = {id: user, name: req.body.userName};
          res.redirect('/');
        });
      } else {
        err = 'パスワードが一致しません';
      }
  } else {
    err = req.body.userName + ' は既に登録されています';
  }
  res.render('regist', {title: title, error: err});
  });
});

module.exports = router;
