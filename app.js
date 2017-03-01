const http = require('http');
const server = http.createServer();
const fs = require('fs');
const socketio = require('socket.io');

server.on('request', function (req, res) {
  fs.readFile('./client/index.html', 'utf8', function (err, data) {
    if (err) {
      res.writeHead(404, {'Content-type': 'text/plain'});
      res.write('page not found!!');
      return res.end();
    }
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(data);
    res.end();
  });
});

const port = 3000;
server.listen(port, function () {
  console.log('server runing on port ' + port);
});

const io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
  // console.log(socket);
  socket.on('message', function (data) {
    // console.log(data.value);
    io.sockets.emit('from_server', {value: data.value});
  });
});

// socket.broadcast.emit('in', {value: "login "}); //自分以外に送信
