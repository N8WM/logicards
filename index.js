const express = require('express');
const app = express();
const port = /*8080;*/ process.env.PORT;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rooms = [];
var names = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/template/index.html');
});

io.on('connection', function(socket){
  /**
  socket.emit('request', ####); // emit an event to the socket
  io.emit('broadcast', ####); // emit an event to all connected sockets
  socket.on('reply', function(){ #### }); // listen to the event
  **/
  socket.on('new room code', function(code){
    rooms.push(code.toUpperCase());
    socket.emit('room verified');
  });
  socket.on('join room', function(code){
    if (rooms.includes(code.toUpperCase())) {
      socket.emit('code verified');
    }
    else {
      socket.emit('code rejected');
    }
  });
  socket.on('new player', function(name){
    if (names.includes(name.toUpperCase())) {
      socket.emit('name rejected');
    }
    else {
      names.push(name.toUpperCase());
      socket.emit('name verified');
    }
  });

  console.log("load");
});

app.use(express.static('static'));

http.listen(port, () => console.log('Example app listening on port ' + port + '!'));
