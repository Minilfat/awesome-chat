$(document).ready();


function loadChatMessages(paramId, paramType, done) {
    $.post('/messages', {id: paramId, type: paramType}, function(messages) {
        console.log(messages);
        done(JSON.parse(messages));
    });
}



function sendMessage(reciever) {
    // TODO write url
}

function logout() {
    alert('logout');
    $.get('/logout');
}