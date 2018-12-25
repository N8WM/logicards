const express = require('express');
const app = express();
const port = /*8080;*/ process.env.PORT;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var codes = ["n"];
var names = [];
var nameToCode = [];

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
    codes.push(code.toUpperCase());
    socket.emit('room verified');
  });
  socket.on('join room', function(code){
    var pCount = 0;
    for (var i = 0; i < names.length; i++) {
      if (nameToCode[i] === codes.indexOf(code.toUpperCase())) {
        pCount++;
      }
    }
    if (codes.includes(code.toUpperCase()) && pCount < 4) {
      socket.emit('code verified');
    }
    else {
      socket.emit('code rejected');
    }
  });
  socket.on('new player', function(name, code){
    if (names.includes(name.toUpperCase())/* || name.indexOf(",") >= 0*/) {
      socket.emit('name rejected');
    }
    else {
      names.push(name.toUpperCase());
      nameToCode.push(codes.indexOf(code.toUpperCase()));
      var arrStr = "";
      if (names.length > 0) {
        for (var n = 0; n < names.length - 1; n++) {
          if (nameToCode[n] === codes.indexOf(code.toUpperCase())) {
            arrStr += names[n] + ",";
          }
        }
        arrStr += names[names.length - 1];
      }
      socket.emit('name verified', '{ "ns":"'+arrStr+'" }');
    }
  });

  console.log("load");
});

app.use(express.static('static'));

http.listen(port, () => console.log('Example app listening on port ' + port + '!'));
