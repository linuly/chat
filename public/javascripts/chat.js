var socket = io.connect();

var user = document.getElementById('messageForm').dataset.user;
var room = document.getElementById('room-name').dataset.room;

function send() {
  var message = document.getElementById('message');
  if (message.value != '') {
    socket.emit('message', {'user': user, 'room': room, 'message': message.value});
  }
  message.value = '';
  return false;
}

socket.on('receive_message', function (data) {
  if (data.data.id == room) {
    if (data.user.id == user) {
      var foo = 'me';
      var name = '';
    } else {
      var foo = 'you';
      var name = "<div class='name'>" + data.user.name + "</div>"
    }
    var board = document.querySelector('.board');
    board.insertAdjacentHTML('beforeend',
      "<div class='" + foo + "'>" + name + "<div class='message well'><span>" + data.data.message + "</span></div>"
    );
  }
});
