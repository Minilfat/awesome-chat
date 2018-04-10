// import 'backendUrls.js';
var activeChat;

/**
 * Handle receiving or sending a message.
 * @param {string} text - The message.
 * @param {Object} sender - Senders name, photo and other information.
 */

function addMessage(text, chatid, sender) {
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
            handleNotification(chatid);
        }
        // If text was not passed to a function, user sent a message
    } else if (typeof text === 'undefined') {
        // Take user input message and show it
        text = document.getElementById('send-message-text').value;
        //add here info about current user
        showMessageOnScreen(text);
        // Clear input
        document.getElementById('send-message-text').value = '';
        // TODO add url for sending message to backend
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
}

/**
 * Send notification to a user.
 * @param {string} chatid - The unique number/name of chat.
 */

function handleNotification(chatid) {
    alert('new message from chat', chatid);
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
    activeChat = document.getElementById(id)
    activeChat.classList.add('active');
    // Add all messages to the main screen
    document.getElementById('messages-body-id').innerHTML = ''
    var messages = loadChatMessages();
    for (var i = 0; i < messages.length; i++) {
        showMessageOnScreen(messages[i]);
    }
}
