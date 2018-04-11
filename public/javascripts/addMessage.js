// Import 'backendUrls.js';
import {connection} from 'connection';
var activeChat;

/**
 * Handle receiving or sending a message.
 * @param {string} text - The message.
 * @param {Object} sender - Senders name, photo and other information.
 * @param {Date} date - Date and time of message.
 * @param {String} type - Type of conversation: 'dialog'/'chat'.
 */

export function addMessage(text, chatid, sender, date, type) {
    // TODO rewrite paragraphs for writing message: add contact lists, move incoming messages, mark as unread
    // If the text and chatid are defined, message came from backend
    if (typeof text !== 'undefined' && chatid !== 'undefined') {
        // Check the opened chatid
        var input = activeChat.getElementsByTagName('input')[0];
        var openedChatId = input.value;
        // If the chat is already opened add a message to a screen
        // Else - notify user about new message
        if (openedChatId === chatid) {
            showMessageOnScreen(text, sender);
        } else {
            handleNotification(chatid, text);
        }
        // If text was not passed to a function, user sent a message
    } else if (typeof text === 'undefined') {
        text = document.getElementById('send-message-text').value;         // Take user input message and show it
        showMessageOnScreen(text);                                        // Add here info about current user
        document.getElementById('send-message-text').value = '';         // Clear input
        // TODO initialize type sender
        let msgInfo = _getActiveChatIdType();
        chatid = msgInfo.chatid;
        type = msgInfo.type;
        connection.send({type: type, text: text, sender_id: sender, id: chatid});
        // TODO add url for sending message to backend
    }
}

function _getActiveChatIdType() {
    let answer = {}
    let inputs = activeChat.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('chat_id')) {
            answer.chatid = inputs[i].value
        }
        if (inputs[i].classList.contains('chat_type')) {
            answer.type = inputs[i].value
        }
    }
}

/**
 * Show message on the active screen.
 * @param {string} text - The message.
 * @param {Object} sender - Senders name, photo and other information.
 */

function showMessageOnScreen(text, sender) {
    var input = $('#messages-body-id');
    var i = 0;

    // Add message body to a chat
    input.append('<div id=\'' + (i++) + '\' class="message col-sm-7">\n' +
        '        <div>\n' +
        '            <img class="inline contact-photo" src="images/ellipse.svg">\n' +
        '            <div class="inline message-text">\n' +
        '                <p>' + sender + '</p><p>' + text + '</p></div></div></div>');

    var objDiv = document.getElementById('messages-body-id');
    objDiv.scrollTop = objDiv.scrollHeight;
}

/**
 * Send notification to a user.
 * @param {string} chatid - The unique number/name of chat.
 */

function handleNotification(chatid, text) {
    alert('new message from chat', chatid, ' Message: ', text);
}

function showContact(contact) {
    var contactBody = $('#contact-list-panel-id');

    contactBody.append('' +
        '')

}

/**
 * Toggle active chats.
 * @param {Object} el - The div element which defines the chat.
 * @param {string} chatid - The unique number/name of the chat.
 */

function chooseChat(el, id) {
    var activeChats = document.getElementsByClassName('contact active');
    Array.prototype.forEach.call(activeChats, function (el) {
        el.classList.remove('active');
    });
    activeChat = document.getElementById(id);
    activeChat.classList.add('active');
    // Add all messages to the main screen
    document.getElementById('messages-body-id').innerHTML = '';
    var messages = loadChatMessages();
    for (var i = 0; i < messages.length; i++) {
        showMessageOnScreen(messages[i]);
    }
}

