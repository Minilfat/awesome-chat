
const db = require('../db/DBmodule');

var clients = {};


module.exports = (wss) => {

  wss.on('connection', function connection(ws, req) {

    let user_data = req.url.replace("/", "").split("%20");
    let user_id = Number(user_data[0]);
    let user_name = user_data[1];
    console.log('Clients url ',req.url);
    console.log("Adding a new client: ", user_id)
    console.log("Adding a new name: ", user_name)
    clients[user_id] = ws;
    // console.log(ws);

    ws.on('message', function(msg) {
      let message = JSON.parse(msg);
      console.log("Message is received!", message);

      let date = new Date();
      message.time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      message.user_name = user_name;
      console.log(message);
  
      console.log("Sender id: ", message.sender_id)
      if (message.type === 'dialog'){
          db.findDialogReceiver(message.id, message.sender_id)
            .then(res => {
              // console.log("Result from db: ", res)
              if (res.rowCount > 0) {
                console.log('Message should receive this client: ', res.rows[0].user_id);
                // TODO: определиться, что делать, если клиента нет в списке активных сокетов
                console.log("sending message to: ", res.rows[0].user_id);
                console.log('******************** ', message, '******************** ');

                clients[res.rows[0].user_id].send(JSON.stringify(message));

                db.saveMessage(message.sender_id, message.text, message.time)
                  .then(res => {
                    if (res.rowCount > 0){
                      db.saveDialogMessage(message.id, res.rows[0].message_id)
                        .catch(err =>  {
                          console.error('Error saving dialog message', err.stack);
                        });
                    }
                    else {
                      console.log("Cannot find just sent message !", message.id);
                    }
                  })
                  .catch(err =>  {
                    console.error('Error saving message!', err.stack);
                  });
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
  
          db.findChatUsers(message.id, message.sender_id)
            .then(res => {
              if (res.rowCount > 0) {
                res.rows.forEach(row => clients[row.user_id].send(JSON.stringify(message)));

                db.saveMessage(message.sender_id, message.text, message.time)
                  .then(res => {
                    if (res.rowCount > 0){
                      db.saveChatMessage(res.rows[0].message_id, message.id)
                        .catch(err =>  {
                          console.error('Error saving chat message', err.stack);
                        });
                    }
                    else {
                      console.log("Cannot find just sent message !", message.id);
                    }
                  })
                  .catch(err =>  {
                    console.error('Error saving message!', err.stack);
                  });
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