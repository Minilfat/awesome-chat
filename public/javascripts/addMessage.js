// Connection establishment

const connection = new WebSocket(`ws://10.240.19.194:3000/`+ this._getSenderId());

connection.onopen = function () {
    // First we want users to enter their names
    console.log('Connection is opened');

};

connection.onerror = function (error) {
    console.log('Error occured. Please, check connection with external server. Error:', error);
};

connection.onmessage = function (message) {
    console.log("Got a message! ", message);
    var json = {};
    try {
        json = JSON.parse(message.data);
    } catch (e) {
        console.log('Not a valid JSON ', message.data);
    }
    // Text, chatid, sender, date, type
    console.log("Got a message, I am a ", this._getSenderId())

    addMessage(json.text, json.chatid, json.sender_id, json.date, json.type);
};

var activeChat;

/**
 * Handle receiving or sending a message.
 * @param {string} text - The message.
 * @param {string} chatid - The unique number/name of the chat.
 * @param {Object} sender - Senders name, photo and other information.
 * @param {Date} date - Date and time of message.
 * @param {String} type - Type of conversation: 'dialog'/'chat'.
 */

function addMessage(text, chatid, sender, date, type) {
    // TODO rewrite paragraphs for writing message: add contact lists, move incoming messages, mark as unread
    // If the text and chatid are defined, message came from backend
    if (typeof text !== 'undefined' && chatid !== 'undefined') {
        // Check the opened chatid
        let input = activeChat.getElementsByTagName('input')[0];
        let openedChatId = input.value;
        let chatInfo = _getActiveChatIdType();
        // If the chat is already opened add a message to a screen
        // Else - notify user about new message

        if (chatInfo.chatid === chatid ) {
            console.log("Show message")
            showMessageOnScreen(text, sender);
        } else {
            //handleNotification(chatid, text);
            alert("gotcha")
        }
        // If text was not passed to a function, user sent a message
    } else if (typeof text === 'undefined') {
        text = document.getElementById('send-message-text').value;         // Take user input message and show it
        document.getElementById('send-message-text').value = '';         // Clear input
        // TODO initialize type sender
        let msgInfo = _getActiveChatIdType();
        chatid = msgInfo.chatid;
        type = msgInfo.type;
        let senderId = this._getSenderId();

        showMessageOnScreen(text, this._getMyName(), new Date())
        connection.send(JSON.stringify({type: type, text: text, sender_id: senderId, id: chatid}));
        // TODO add url for sending message to backend
    }
}

function _getSenderId() {
    return document.getElementById('user-id').value;
}

function _getMyName() {
    return document.getElementById('user-name').value;
}

function _getActiveChatIdType() {
    let answer = {};
    let inputs = activeChat.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('chat_id')) {
            answer.chatid = inputs[i].value
        }
        if (inputs[i].classList.contains('chat_type')) {
            answer.type = inputs[i].value
        }
    }
    return answer;
}

/**
 * Show message on the active screen.
 * @param {string} text - The message.
 * @param {Object} sender - Senders name, photo and other information.
 */

function showMessageOnScreen(text, sender, message_time) {
    var input = $('#messages-body-id');

    let formatMesTime = message_time.getHours() + ':' + message_time.getMinutes()
    // Add message body to a chat
    input.append('<div class="message col-sm-5">\n' +
        '        <div>\n' +
        '            <div class="inline message-text col-sm-12">\n' +
        '                <div class="inline"><p class="sender-name inline">' + sender + '</p> <p class="inline time">' + formatMesTime + '</p></p></div><p>' + text + '</p>' +
        '            </div>' +
        '        </div>' +
        '</div>' +
        '</div>');

    var objDiv = document.getElementById('messages-body-id');
    objDiv.scrollTop = objDiv.scrollHeight;
}

/**
 * Send notification to a user.
 * @param {string} chatid - The unique number/name of chat.
 */

function handleNotification(chatid, text) {
    //alert('new message from chat', chatid, ' Message: ', text);
}

function showContact(contact) {
    var contactBody = $('#contact-list-panel-id');

    contactBody.append("<div class=\"chat-list-panel\">\n" +
        "  <div class=\"contact inline\" id=" + contact.id+contact.type + " onclick=\"chooseChat(this, '" + contact.id+contact.type + "')\">\n" +
        "    <div>" +
        "      <div class=\"inline chat-title\">\n" +
        "        <p>"+ contact.name +"</p>\n" +
        "      </div>\n" +
        "      <input type=\"hidden\" class=\"chat_id\" value=" + contact.id + ">\n" +
        "      <input type=\"hidden\" class=\"chat_type\" value=" + contact.type + ">\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>")
}

/**
 * Toggle active chats.
 * @param {Object} el - The div element which defines the chat.
 * @param {string} chatid - The unique number/name of the chat.
 */

function chooseChat(el, id) {
    var activeChats = document.getElementsByClassName('contact active');
    console.log("active chat: ", activeChats);
    Array.prototype.forEach.call(activeChats, function (el) {
        el.classList.remove('active');
    });
    activeChat = document.getElementById(id);
    activeChat.classList.add('active');
    // TODO Add all messages to the main screen
    document.getElementById('messages-body-id').innerHTML = '';
    let chatParams = _getActiveChatIdType();
    loadChatMessages(chatParams.chatid, chatParams.type, (messages) => {
        messages.forEach(mes => showMessageOnScreen(mes.text, mes.sender, mes.time));
    });
}

$(document).ready(function () {
    $.get('/contacts', function(contacts) {
            console.log('Contacts:', contacts);
            let tmp = [...JSON.parse(contacts)];
            tmp.forEach(contact => showContact(contact))
    })
})

