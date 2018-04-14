
const db = require('../db/DBmodule');

var clients = {};


module.exports = (wss, user_id) => {

  wss.on('connection', function connection(ws) {
    console.log("Adding a new client: ", user_id)
    clients[user_id] = ws;

    ws.on('message', function(msg) {
      let message = JSON.parse(msg);
      console.log("Message is received!", message);

      let date = new Date();
      message.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      console.log(message);
  
      if (message.type === 'dialog'){
          let receiver = db.findDialogReceiver(message.id, message.sender_id);
          
          receiver
            .then(res => {
              if (res.rowCount > 0) {

                // TODO: определиться, что делать, если клиента нет в списке активных сокетов
                clients[res.rows[0].user_id].send(JSON.stringify(message));
              }
              else {
                console.log("Results:", res)
                console.log("Cannot find receiver in dialog!", message.id);
              }
            })
            .catch(err =>  {
              console.error('Error executing query', err.stack);
            });
      }
      else if (message.type === 'chat') {
  
          let users = db.findChatUsers(message.id, message.sender_id);

          console.log(users);

          users
            .then(res => {
              if (res.rowCount > 0) {
                res.rows.forEach(row => clients[row.user_id].send(message));
              }
              else {
                console.log("Cannot find receivers in this chat!", message.id);
              }
            })
            .catch(err =>  {
              console.error('Error executing query', err.stack);
            });
      }
      else {
        console.log("IDONO")
      }
      ws.on('error', function(error) {
        console.log("Error happened! ", error)
      })

  
    ws.on('close', function(connection) {
      console.log('Connection is closed');
    });
  });})
};