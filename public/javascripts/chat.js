var socket = io.connect();

function send(elm) {
  var forms = elm.form;
  var name = forms.name;
  var message = forms.message;
  if (name.value != '' && message.value != '') {
    socket.emit('message', {value: {'name': name.value, 'message': message.value}});
  } else {
    var dashboard = document.getElementByid('messageForm');
    dashboard[0].insertAdjacentHTML('afterend', "<p style='color: red;'>※全部入力してね</p>");
  }
  message.value = '';
}

socket.on('from_server', function (data) {
  write(data.value);
});

function write(message) {
  var dashboard = document.getElementsByClassName('dashboard');
  dashboard[0].insertAdjacentHTML('beforeend', "<p>" + message.name + ": " + message.message + "</p>");
}
// 
