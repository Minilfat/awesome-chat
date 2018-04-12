
const db = require('../db/DBmodule');

var clients = {};


module.exports = wss => {
  //wss.on('request', function(request) {

    // console.log(request);
  wss.on('connection', function connection(ws) {
    ws.on('message', function(msg) {
      console.log("Got a message: ", JSON.parse(msg))
      let message = JSON.parse(msg);
      console.log("Message is received!", message)
      console.log(message)
      var date = Date.now();
      message.date = '${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}';
  
      clients[message.sender_id] = ws;
  
      if (message.type === 'dialog'){
        // TODO send to another user
          clients[message.sender_id].send(JSON.stringify(message));
      }
      else if (message.type === 'chat') {
  
          //var users = db.findChatUsers(message.id);
  
          //users.forEach(user => clients[user].send(message));
      }
      else {
        console.log("IDONO")
      }
      ws.on('error', function(error) {
        console.log("Error happened! ", error)
      })


   // });
  
    ws.on('close', function(connection) {
      console.log('Connection is closed');
    });
  });})
};