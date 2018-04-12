// const config = require('config');
// const WebSocket = require('ws');

// const wss = new WebSocket.Server({
//     port: config.get('port')
// });

var WebSocketServer = require('websocket').server;

const db = require('../db/DBmodule');
const app = require('../app');

wsServer = new WebSocketServer({
  httpServer: app
});

var clients = {};

wsServer.on('request', function(request) {

  connection.on('message', function(message) {
    var date = Date.now();
    message.date = `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}`;

    clients[message.sender_id] = request.accept(null, request.origin);

    if (message.type === 'dialog'){
        clients[message.sender_id].send(message);
    }
    else if (message.type === 'chat') {

        var users = db.findChatUser(message.id);

        users.forEach(user => clients[user].send(message));
    }
    else {
        alert('Error!');
    }
  });

  connection.on('close', function(connection) {
    console.log('Connection is closed');
  });
});
