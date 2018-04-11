$(document).ready();

// TODO write doc
function loadUserContacts() {
    $.get('/contacts', function(contacts) {
        console.log(JSON.parse(contacts));
        return JSON.parse(contacts);
    });
}

function loadChatMessages(paramId, paramType) {
    $.post('/messages', {id: paramId, type: paramType}, function(messages) {
        console.log(messages);
        return messages;
    });
    // return ['thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there'];
}

function sendMessage(reciever) {
    // TODO write url
}