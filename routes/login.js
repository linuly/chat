var express = require('express');
var router = express.Router();
var db = require('../js/mongo');
console.log(db);

router.get('/', function(req, res, next) {
  res.render('login', {title: 'Chat Login'});
});

router.post('/', function(req, res, next) {

  var data = db.select('user', {user_name: req.body.userName, user_password: req.body.userPassword}, {});
console.log(data);
data = null;
  if(data) {
    req.session.user = {name: req.body.userName};
    // ユーザー認証
    console.log(req.body);
    res.redirect('/');
  } else {
    var err = '入力が正しくありません。確認して再入力してください。';
    res.render('login', {title: err});
    // var data = db.insert('user', {user_name: req.body.userName, user_password: req.body.userPassword});

    // res.redirect('/');
  }
});

module.exports = router;
