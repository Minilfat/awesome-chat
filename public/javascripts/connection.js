// import {addMessage} from 'addMessage';

// // Open connection
// const connection = new WebSocket('ws://127.0.0.1:1337');
// console.log(connection);

// connection.onopen = function () {
//     // First we want users to enter their names
//     console.log('Connection is opened');
// };

// connection.onerror = function (error) {
//     console.log('Error occured. Please, check connection with external server. Error:', error);
// };

// connection.onmessage = function (message) {
//     var json = {};
//     try {
//         json = JSON.parse(message.data);
//     } catch (e) {
//         console.log('Not a valid JSON ', message.data);
//     }
//     // Text, chatid, sender, date, type
//     addMessage(json.text, json.chatid, json.sender, json.date, json.type);
// }

