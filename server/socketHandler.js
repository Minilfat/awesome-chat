
const db = require('../db/DBmodule');

var clients = {};


module.exports = wss => {
  wss.on('request', function(request) {

    console.log(request);
  
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
};