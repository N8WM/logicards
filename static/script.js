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

var roomCode = 0;

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

  // document.getElementById("connect-page").innerHTML += "<div style='position:absolute;font-family:sans-serif;line-height:20px;width:fit-content;padding:20px;border-radius:3px;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);background-color:#AA0;color:#FFF;'>Player 1: " + teamA[0].toString() + "<br />Player 2: " + teamA[1].toString() + "<br />Player 3: " + teamB[0].toString() + "<br />Player 4: " + teamB[1].toString() + "</div>";
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

function newroom() {
  var startPage = document.getElementById("start-page");
  var connectPage = document.getElementById("connect-page");
  startPage.classList.toggle("focused");
  connectPage.classList.toggle("focused");
  document.body.style.backgroundColor = "#CC0";
  roomCode = generateRC();
  connectPage.innerHTML = "<div style='text-align:center;position:absolute;font-family:sans-serif;line-height:20px;width:fit-content;padding:20px;border-radius:3px;left:50%;top:50px;transform:translateX(-50%);background-color:#AA0;color:#FFF;'><span style='font-weight: 900;'>Room Code:</span><br /><br />" + roomCode + "<br /><br />Waiting for players...</div>";
}

function joinroom() {
  var startPage = document.getElementById("start-page");
  var connectPage = document.getElementById("connect-page");
  startPage.classList.toggle("focused");
  connectPage.classList.toggle("focused");
  document.body.style.backgroundColor = "#1295D7";
  connectPage.innerHTML = "<div id='rcode-div'><input type='text' id='rcode-inp' placeholder='room code' /><button id='rcode-btn' ontouchstart='joinDown()' ontouchend='joinUp()'>Join</button></div>";
  var inp = document.getElementById("rcode-inp");
  var btn = document.getElementById("rcode-btn");
  var div = document.getElementById("rcode-div");
  inp.style.width = div.offsetWidth - btn.offsetWidth - 1 + "px";
}

function generateRC() {
  var c = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var n = ['0','1','2','3','4','5','6','7','8','9'];
  return n[Math.floor(Math.random()*10)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+c[Math.floor(Math.random()*26)]+n[Math.floor(Math.random()*10)]+n[Math.floor(Math.random()*10)]+n[Math.floor(Math.random()*10)];
}

function joinDown() {
  var inp = document.getElementById("rcode-inp");
  var btn = document.getElementById("rcode-btn");
  inp.style.borderColor = "#AA0";
  btn.style.borderColor = "#AA0";
  btn.style.backgroundColor = "#AA0";
}

function joinUp() {
  var inp = document.getElementById("rcode-inp");
  var btn = document.getElementById("rcode-btn");
  var div = document.getElementById("rcode-div");
  inp.style.borderColor = "#CC0";
  btn.style.borderColor = "#CC0";
  btn.style.backgroundColor = "#CC0";
  roomCode = inp.value;
  btn.innerHTML = inp.value;
  inp.style.width = div.offsetWidth - btn.offsetWidth - 1 + "px";
}
