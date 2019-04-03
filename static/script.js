var socket = io();

  //var cnumbers = ["AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD",
  //                "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS"];
  //               card: [used, flipped]

var cnumbers = [[false, false], [false, false], [false, false], [false, false],
                [false, false], [false, false], [false, false], [false, false],
                [false, false], [false, false], [false, false], [false, false],
                [false, false], [false, false], [false, false], [false, false],
                [false, false], [false, false], [false, false], [false, false],
                [false, false], [false, false], [false, false], [false, false]];

var teamA = [[0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0]];

var teamB = [[0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0]];

var roomCode = "";
var names = [];

function initiate() {
  for(var card=0;card<24;card++){    // distribute 24 cards randomly among players
    var cnum=Math.floor((Math.random()*24));
    while(cnumbers[cnum][0]){cnum=Math.floor((Math.random()*24.0));}
    if(Math.floor(card/6)===0){teamA[0][card]=cnum;}
    else if(Math.floor(card/6)===1){teamA[1][card-6]=cnum;}
    else if(Math.floor(card/6)===2){teamB[0][card-12]=cnum;}
    else{teamB[1][card-18]=cnum;}
    cnumbers[cnum][0]=true;
  }teamA=[bubbleSort(teamA[0]).slice(), bubbleSort(teamA[1]).slice()];    // sort
  teamB=[bubbleSort(teamB[0]).slice(), bubbleSort(teamB[1]).slice()];
  document.getElementById("rcode-inp").style.width=document.getElementById("rcode-div").offsetWidth-document.getElementById("rcode-btn").offsetWidth-1+"px";
  // document.getElementById("connect-page").innerHTML += "<div style='position:absolute;font-family:sans-serif;line-height:20px;width:fit-content;padding:20px;border-radius:3px;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);background-color:#AA0;color:#FFF;'>Player 1: " + teamA[0].toString() + "<br />Player 2: " + teamA[1].toString() + "<br />Player 3: " + teamB[0].toString() + "<br />Player 4: " + teamB[1].toString() + "</div>";
}

function newroom() {  //Runs when a user makes a new room, gets a room id from the server and adds the user
  console.log("running newroom");

  var inp = document.getElementById("name-inp");
  var btn = document.getElementById("name-btn");
  var div = document.getElementById("name-div");
  var rcodeSpan = document.getElementById("rcode-span");

  uname = inp.value.toUpperCase();
  ret_addr_accepted = generateRC();
  ret_addr_rejected = generateRC();

  socket.emit('new_room', '{ "user":"'+uname+'", "ret_good":"'+ret_addr_accepted+'", "ret_bad":"'+ret_addr_rejected+'" }');

  socket.on(ret_addr_accepted, function(data){
    code = JSON.parse(data).code;
    ns = JSON.parse(data).names;

    roomCode = code;
    rcodeSpan.innerHTML = code;

    names = ns.split(",");
    inp.style.borderColor = "#CC0";
    btn.style.backgroundColor = "#CC0";
    document.body.style.backgroundColor = "#CC0";
    var jPlayersStr = "";
    for (var i = 0; i < names.length; i++) {
      jPlayersStr += "<div class='connect-div'>" + names[i] + "</div>";
    }
    var jPlayers = document.getElementById("j-players");
    jPlayers.innerHTML = jPlayersStr;

    connect();
  });

  socket.on(ret_addr_rejected, function(){
    inp.style.borderColor = "#C00";
    btn.style.backgroundColor = "#C00";
    inp.value = "";
  });
}

function chooseRoom() {
  var inp = document.getElementById("rcode-inp");
  var btn = document.getElementById("rcode-btn");
  ret_addr_accepted = generateRC();
  ret_addr_rejected = generateRC();

  socket.emit('room_query', '{"code":"'+inp.value.toUpperCase()+'", "ret_good":"'+ret_addr_accepted+'", "ret_bad":"'+ret_addr_rejected+'"}');

  socket.on(ret_addr_accepted, function(){
    document.getElementById("name-btn").setAttribute("onclick", "addUser()");
    document.getElementById("name-btn").setAttribute("ontouchend", "addUser()");
    roomCode = inp.value.toUpperCase();
    focusName();
  });

  socket.on(ret_addr_rejected, function(){
    inp.style.borderColor = "#C00";
    btn.style.backgroundColor = "#C00";
    inp.value = "";
  });
}

function addUser() {
  var inp = document.getElementById("name-inp");
  var btn = document.getElementById("name-btn");
  var rcodeSpan = document.getElementById("rcode-span");
  ret_good = generateRC();
  bad_uname = generateRC();
  bad_code = generateRC();

  socket.emit('new_user', '{"user":"'+inp.value.toUpperCase()+'", "ret_good":"'+ret_good+'", "bad_uname":"'+bad_uname+'", "bad_code":"'+bad_code+'", "code":"'+roomCode+'"}');

  socket.on(ret_good, function(data){
    ns = JSON.parse(data).names;

    rcodeSpan.innerHTML = roomCode;

    names = ns.split(",");
    inp.style.borderColor = "#CC0";
    btn.style.backgroundColor = "#CC0";
    document.body.style.backgroundColor = "#CC0";
    var jPlayersStr = "";
    for (var i = 0; i < names.length; i++) {
      jPlayersStr += "<div class='connect-div'>" + names[i] + "</div>";
    }
    var jPlayers = document.getElementById("j-players");
    jPlayers.innerHTML = jPlayersStr;

    connect();
  });

  socket.on(bad_uname, function(){
    inp.style.borderColor = "#C00";
    btn.style.backgroundColor = "#C00";
    inp.value = "";
  });
}

/*
  Bubble sort method
  @arr array to sort
  @return sorted array
*/
function bubbleSort(arr) {
  var arrF=arr.slice();var arrC=[];
  while (!arrEqual(arrF, arrC)){
    arrC=arrF.slice();
    for(var i=0;i<arr.length-1;i++){
      if(arrF[i]>arrF[i+1]){var tmp=arrF[i+1];arrF[i+1]=arrF[i];arrF[i]=tmp;}
    }
  }return arrF;
}
/*
  Detect if two arrays are equal
  @arr1 array to compare to @arr2
  @arr2 array to compare to @arr1
  @return boolean: do they equal eachother?
*/
function arrEqual(arr1, arr2) {
  if(arr1.length!==arr2.length){return false;}
  for(var i=0;i<arr1.length;i++){if(arr1[i]!==arr2[i]){return false;}}
  return true;
}

function generateRC() {
  console.log("running generateRC");
  var c = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var n = ['0','1','2','3','4','5','6','7','8','9'];
  return c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+n[Math.floor(Math.random()*10)]+n[Math.floor(Math.random()*10)];
}

//Cosmetic functions to update styling
function joinroom() {
  console.log("running joinroom");
  focusJoin();
  document.body.style.backgroundColor = "#1295D7";
}

function joinDown() {
  console.log("running joinDown");
  var inp = document.getElementById("rcode-inp");
  var btn = document.getElementById("rcode-btn");
  inp.style.borderColor = "#AA0";
  btn.style.backgroundColor = "#AA0";
}

function nameDown() {
  console.log("running nameDown");
  var inp = document.getElementById("name-inp");
  var btn = document.getElementById("name-btn");
  inp.style.borderColor = "#AA0";
  btn.style.backgroundColor = "#AA0";
}

function connect() {
  console.log("running connect");
  focusConnect();
  document.body.style.backgroundColor = "#CC0";
}

function focusJoin() {
  console.log("running focusJoin");
  var startPage = document.getElementById("start-page");
  var namePage = document.getElementById("name-page");
  var joinPage = document.getElementById("join-page");
  var connectPage = document.getElementById("connect-page");
  startPage.classList.remove("focused");
  namePage.classList.remove("focused");
  connectPage.classList.remove("focused");
  joinPage.classList.add("focused");
}

function focusName() {
  console.log("running focusName");
  var startPage = document.getElementById("start-page");
  var namePage = document.getElementById("name-page");
  var joinPage = document.getElementById("join-page");
  var connectPage = document.getElementById("connect-page");
  startPage.classList.remove("focused");
  joinPage.classList.remove("focused");
  connectPage.classList.remove("focused");
  namePage.classList.add("focused");
}

function focusConnect() {
  console.log("running focusConnect");
  var startPage = document.getElementById("start-page");
  var namePage = document.getElementById("name-page");
  var joinPage = document.getElementById("join-page");
  var connectPage = document.getElementById("connect-page");
  startPage.classList.remove("focused");
  namePage.classList.remove("focused");
  joinPage.classList.remove("focused");
  connectPage.classList.add("focused");
  //connectPage.innerHTML += names;
}
//End cosmetic functions


socket.on('update_userlist', function(data) {
  room = JSON.parse(data).room;
  updated_userlist = JSON.parse(data).names;
  if (room == roomCode){
    console.log("recieved update");
    names = updated_userlist.split(",");
    var jPlayersStr = "";
    for (var i = 0; i < names.length; i++) {
      jPlayersStr += "<div class='connect-div'>" + names[i] + "</div>";
    }
    var jPlayers = document.getElementById("j-players");
    jPlayers.innerHTML = jPlayersStr;
  } else {
    console.log("another room is updtating!");
  }
});
