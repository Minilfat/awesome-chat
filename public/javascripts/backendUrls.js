function loadUserContacts() {
    $.get('/contacts', function(contacts){
        console.log(contacts);
        return contacts;
    });
}

function loadChatMessages() {
    // TODO write url
    return ['thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there', 'thetr', 'hi there'];
}

function sendMessage(reciever) {
    // TODO write url
}