$(document).ready();


function loadChatMessages(paramId, paramType, done) {
    $.post('/messages', {id: paramId, type: paramType}, function(messages) {
        done([...JSON.parse(messages)]);
    });
}

function sendMessage(reciever) {
    // TODO write url
}

function logout() {
    // alert('logout');
    $.get('/logout');
}