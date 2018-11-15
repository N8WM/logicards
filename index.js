const express = require('express');
const app = express();
const port = process.env.PORT;
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  /**
  socket.emit('request', ####); // emit an event to the socket
  io.emit('broadcast', ####); // emit an event to all connected sockets
  socket.on('reply', function(){ #### }); // listen to the event
  **/
  console.log("connection initiated");
});

app.use(express.static('public'));

http.listen(port, () => console.log('Example app listening on port ${port}!'));
