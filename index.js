const express = require('express');
const app = express();
const port = process.env.PORT;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rooms = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/template/index.html');
});

io.on('connection', function(socket){
  /**
  socket.emit('request', ####); // emit an event to the socket
  io.emit('broadcast', ####); // emit an event to all connected sockets
  socket.on('reply', function(){ #### }); // listen to the event
  **/
  socket.on('new_room', function(data){
    ret_addr = JSON.parse(data).ret_good;
    reject = JSON.parse(data).ret_bad;
    user = JSON.parse(data).user;
    code = generateRC();
    rooms.push(new Room(code));
    rooms[rooms.length-1].addMember(user);
    console.log(rooms);
    code = '{"code":"'+code+'", "names":"'+user+'"}'
    socket.emit(ret_addr, code);
  });

  socket.on('new_user', function(data){
    user = JSON.parse(data).user;
    code = JSON.parse(data).code;
    ret_addr = JSON.parse(data).ret_good;
    bad_code = JSON.parse(data).ret_bad_code;
    bad_uname = JSON.parse(data).ret_bad_uname;
    var found = false;
    for(var i = 0; i < rooms.length; i++){
      console.log(rooms[i]);
      if (rooms[i].code == code){
        var good = true;
        for(var j = 0; j < rooms[i].members.length; j++){
          if (rooms[i].members[j] == user){
            good = false;
            socket.emit(bad_uname);
            j = rooms[i].members.length;
          }
        }
        if (good){
          rooms[i].addMember(user);
          socket.emit(ret_addr, '{"names":"'+rooms[i].members+'"}');
          console.log(rooms);
          socket.broadcast.emit('update_userlist', '{"names":"'+rooms[i].members+'", "room": "'+rooms[i].code+'"}');
        }
        found = true;
        i = rooms.length;
      }
    }
    if (!found){
      socket.emit(bad_code);
    }
  });

  socket.on('room_query', function(data){
    code = JSON.parse(data).code;
    ret_good = JSON.parse(data).ret_good;
    ret_bad = JSON.parse(data).ret_bad;
    var found = false;
    for(var i = 0; i < rooms.length; i++){
      console.log(rooms[i]);
      if (rooms[i].code == code){
        socket.emit(ret_good);
        found = true;
        i = rooms.length;
      }
    }
    if (!found){
      socket.emit(ret_bad);
    }
  });

  console.log("load");
});

function Room(code){
  this.code = code;
  this.members = [];
  this.deck = ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'KH', 'QH',
               'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'KD', 'QD',
               'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'KS', 'QS',
               'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'KC', 'QC']
  this.addMember = function(member_name) {
    this.members.push(member_name);
    return this.code;
  }
}

function generateRC() {
  console.log("running generateRC");
  var c = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var n = ['0','1','2','3','4','5','6','7','8','9'];
  return c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+n[Math.floor(Math.random()*10)]+n[Math.floor(Math.random()*10)];
}

app.use(express.static('static'));

http.listen(port, () => console.log(port));
