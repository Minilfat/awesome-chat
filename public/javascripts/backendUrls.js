$(document).ready();


function loadChatMessages(paramId, paramType, done) {
    $.post('/messages', {id: paramId, type: paramType}, function (messages) {
        console.log(messages);
        return messages;
    });
    // return ['thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there'];
}

function sendMessage(reciever) {
    // TODO write url
}

function logout() {
    alert('logout');
    $.get('/logout');
}