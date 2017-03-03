var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/chat';

var calculate = {
    select:
      /**
       * selectモジュール
       * @param  'name' collectionName [description]
       * @param  {name: value} where          [description]
       * @param  {name: 1} fields         [description]
       * @return {res object}                [description]
       */
      function (collectionName, where, fields) {
        MongoClient.connect(url, function (err, db) {
          var collection = db.collection(collectionName);
          var res = collection.find(where, fields);
          console.log(res);

          // db.on('close', function () {
          //   console.log('close DB');
          // });
          db.close();
          return res;
        });
      },
    insert:
      function (collectionName, set) {
        MongoClient.connect(url, function (err, db) {
          var collection = db.collection(collectionName);
          collection.insertOne(set);
          db.close();
        });
      },
    update: function (a) {

    },
    delete: function (a) {

    }
};
module.exports = calculate;
/*
module.exports = MongoClient.connect('mongodb://localhost:27017/chat', function (err, db) {
  // test.equal(null, err);
  console.log('open DB');
//参考↓
//http://www.yoheim.net/blog.php?q=20150601

  console.log(calculate);
  return calculate;


/*
  var collection = db.collection('user'); // collection = table
  collection.find().forEach(function (elem) {
    console.log(elem.user_id);
  });

  var value = {user_id: 'test', status: 'logout'};
  collection.insertOne(value, function (err, r) {
    console.log('追加作業');
  });
  collection.updateMany({user_id: 'test'}, {$set: {user_id: 'TEST'}}, function (err, r) {
    console.log('修正作業');
  });
  collection.deleteOne({user_id: 'TEST'}, function (err, r) {
    console.log('削除作業');
  });

  db.collection('user').find().forEach(function (elem) {
    console.log(elem.user_name + ' : ' + elem.user_password);
  });

  db.on('close', function () {
    console.log('close DB');
  });
  db.close();

});
*/
