var app = require('express')();
var https = require('https');
const fs = require('fs');

var key = fs.readFileSync(process.env.SNAP_DATA + '/server.key');
var cert = fs.readFileSync(process.env.SNAP_DATA + '/server.crt');
var options = {
  key: key,
  cert: cert
};

var server = https.createServer(options, app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 6565;
server.listen(port);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css');
});

app.get('/fullscreen.png', function(req, res) {
  res.sendFile(__dirname + '/fullscreen.png');
});

app.get('/add.png', function(req, res) {
  res.sendFile(__dirname + '/add.png');
});

app.get('/expand.png', function(req, res) {
  res.sendFile(__dirname + '/expand.png');
});

app.get('/collapse.png', function(req, res) {
  res.sendFile(__dirname + '/collapse.png');
});

app.get('/mute.png', function(req, res) {
  res.sendFile(__dirname + '/mute.png');
});

app.get('/unmute.png', function(req, res) {
  res.sendFile(__dirname + '/unmute.png');
});

app.get('/cam_on.png', function(req, res) {
  res.sendFile(__dirname + '/cam_on.png');
});

app.get('/cam_off.png', function(req, res) {
  res.sendFile(__dirname + '/cam_off.png');
});

app.get('/script.js', function(req, res) {
  res.sendFile(__dirname + '/script.js');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendFile(__dirname + '/webrtc.io.js');
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
