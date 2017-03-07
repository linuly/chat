var socket = io.connect();

var user = document.getElementById('messageForm').dataset.user;
var board = document.querySelector('.board');
board.scrollTop = board.scrollHeight;

document.getElementById('messageForm').onsubmit = function() {
  var room = document.getElementById('room-name').dataset.room;
  var message = document.getElementById('message');
  if (message.value != '') {
    socket.emit('message', {'user': user, 'room': room, 'message': message.value});
  }
  message.value = '';
  return false;
}

socket.on('receive_message', function (data) {
  var room = document.getElementById('room-name').dataset.room;
  if (data.data.id == room) {
    insert_message(data.user.id, data.data.message, data.user.name);
  }
});

socket.on('receive_room', function (data) {
  if (data.user.id == user) {
    insert_room('\'' + data.room.id + '\'', data.room.name);
  }
});

function modal_btn(type) {
  if (type == 'contact') {
    var title = '部屋の追加';
    var holder = '部屋名';
    var event = 'add_room();';
  } else if (type == 'member') {
    var title = 'メンバーの追加';
    var holder = 'ユーザー名';
    var event = 'add_member();';
  }
  document.querySelector('.modal-title').textContent = title;
  var form = document.getElementById('request');
  form.setAttribute('name', type);
  form.setAttribute('placeholder', holder);
  document.querySelector('.modal-footer').children[0].setAttribute('onclick', event);
  form.focus();
}

var body = document.querySelector('.contact-body');
body.addEventListener("click", function(event) {
var input = event.target.dataset.room;
if (input) {
  var req = getXHR();

  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (req.responseText != 'false') {
          var responseJson = JSON.parse(req.responseText);
          var board = document.querySelector('.board');
          var roomHead = document.getElementById('room-name');
          roomHead.textContent = responseJson.room_name;
          roomHead.dataset.room = responseJson._id;
          board.innerHTML = "";
          Object.keys(responseJson.chat_log).forEach(function (key) {
            var data = responseJson.chat_log[key];
            insert_message(data.user_id, data.message, '');
          });
        }
      } else {
        alert("通信エラーが発生しました");
      }
    }
  }

  req.open('GET','/select?room=' + input, true);
  req.send(null);
}
},false);

function add_member() {
  var room = document.getElementById('room-name').dataset.room;
  var input = document.getElementById('request');
  if (input.value) {
    var req = getXHR();

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        if (req.status == 200) {
           if (req.responseText == 'true') {
             socket.emit('add_room', {'name': input.value, 'room': room});
             input.value = '';
             $('#modal').modal('hide');
           } else {
             console.log(req.responseText);
           }
        } else {
          alert("通信エラーが発生しました");
        }
      }
    }

    req.open('GET','/member?name=' + input.value + '&room=' + room, true);
    req.send(null);
  }
}

function add_room() {
  var input = document.getElementById('request');
  if (input.value) {
    var req = getXHR();

    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        if (req.status == 200) {
           if (req.responseText != 'false') {
             insert_room(req.responseText, input.value);
             input.value = '';
             $('#modal').modal('hide');
           }
        } else {
          alert("通信エラーが発生しました");
        }
      }
    }

    req.open('GET','/room?name=' + input.value, true);
    req.send(null);
  }
}

function insert_message(id, message, namedata = null) {
  if (id == user) {
    var foo = 'me';
    var name = '';
  } else {
    var foo = 'you';
    var name = "<div class='name'>" + namedata + "</div>"
  }
  board.insertAdjacentHTML('beforeend',
    "<div class='" + foo + "'>" + name + "<div class='message well'><span>" + message + "</span></div>"
  );
  board.scrollTop = board.scrollHeight;
}

function insert_room(id, name) {
  var body = document.querySelector('.contact-body');
  body.insertAdjacentHTML('afterbegin',
    "<div class='list-group-item' data-room=" + id + ">" + name + "</div>"
  );
}

function getXHR() {
  var req;
  try {
    req = new XMLHttpRequest();
  } catch (e) {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return req;
}
