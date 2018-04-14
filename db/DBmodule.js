const config = require('config');

const { Pool, Client } = require('pg');
const pool = new Pool(config.get('db'));

pool.connect();

function clean() {
    return pool.query('DROP TABLE users, chats, messages, users_chats, chat_messages, dialogs, dialog_messages;');
}
// clean()
//   .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

function createUsers() {
    return pool.query('CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, login VARCHAR(50) UNIQUE, password CHAR(60) NOT NULL, alias VARCHAR(50) NOT NULL)');
}
function createChats() {
    return pool.query('CREATE TABLE IF NOT EXISTS chats (chat_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL)');
}
function createMessages() {
    return pool.query('CREATE TABLE IF NOT EXISTS messages (message_id SERIAL PRIMARY KEY, sender_id INTEGER REFERENCES users ON DELETE CASCADE, text TEXT NOT NULL, date_time TIMESTAMP NOT NULL)');
}
function createUsersChats() {
    return pool.query('CREATE TABLE IF NOT EXISTS users_chats (user_id INTEGER REFERENCES users ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');
}
function createChatMessages() {
    return pool.query('CREATE TABLE IF NOT EXISTS chat_messages (message_id INTEGER REFERENCES messages ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');
}
function createDialogs() {
    return pool.query('CREATE TABLE IF NOT EXISTS dialogs (dialog_id SERIAL PRIMARY KEY, user1_id INTEGER REFERENCES users ON DELETE CASCADE, user2_id INTEGER REFERENCES users ON DELETE CASCADE)');
}
function createDialogMessages() {
    return pool.query('CREATE TABLE IF NOT EXISTS dialog_messages (dialog_id INTEGER REFERENCES dialogs ON DELETE CASCADE, message_id INTEGER REFERENCES messages ON DELETE CASCADE)');
}


// createUsers()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createChats()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createMessages()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createUsersChats()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createChatMessages()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createDialogs()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

// createDialogMessages()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });


function saveUser(login, password, alias) {
    return pool.query('INSERT INTO users(login, password, alias) VALUES($1, $2, $3) RETURNING user_id', [login, password, alias]);
}

function saveChat(name) {
    return pool.query('INSERT INTO chats(name) VALUES($1) RETURNING chat_id', [name]);
}

function saveChatUser(login, chat_name) {
    return pool.query('INSERT INTO users_chats(user_id, chat_id) VALUES((SELECT user_id FROM users WHERE login=$1), (SELECT chat_id FROM chats WHERE name=$2))', [login, chat_name]);
}
// saveChatUser()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

function saveChatMessage(message_id, chat_id) {
    return pool.query('INSERT INTO chat_messages(message_id, chat_id) VALUES($1, $2)', [message_id, chat_id]);
}

function saveDialog(login1, login2) {
    return pool.query('INSERT INTO dialogs(user1_id, user2_id) VALUES((SELECT user_id FROM users WHERE login=$1), (SELECT user_id FROM users WHERE login=$2)) RETURNING dialog_id', [login1, login2]);
}
// saveDialog()
// .catch(err =>  {
//     console.error('Error executing query', err.stack);
//   });

function saveDialogMessage(dialog_id, message_id) {
    return pool.query('INSERT INTO dialog_messages(dialog_id, message_id) VALUES($1, $2)', [dialog_id, message_id]);
}

function saveMessage(sender_id, text='', date_time=0) {
    return pool.query('INSERT INTO messages(sender_id, text, date_time) VALUES($1, $2, $3) RETURNING message_id', [sender_id, text, date_time]);
}


function findUser(login) {
    return pool.query('SELECT * FROM users WHERE login=$1', [login]);
}


function findChat(chat_id) {
    return pool.query('SELECT * FROM chats WHERE chat_id=$1', [chat_id]);
}

function findChatUsers(chat_id, sender_id) {
    return pool.query('SELECT user_id FROM users_chats WHERE users_chats.chat_id=$1 AND users_chats.user_id!=$2', [chat_id, sender_id]);
}

function findDialogReceiver(dialog_id, sender_id) {
    return pool.query('SELECT user1_id as user_id FROM dialogs WHERE dialog_id=$1 AND user2_id=$2 \
                       UNION \
                       SELECT user2_id as user_id FROM dialogs WHERE dialog_id=$1 AND user1_id=$2', [dialog_id, sender_id]);
}

function findMessage(message_id) {
    return pool.query('SELECT * FROM messages WHERE message_id=$1', [message_id]);
}


function deleteUser(login) {
    return pool.query('DELETE FROM users WHERE login=$1', [login]);
}

function deleteChat(chat_id) {
    return pool.query('DELETE FROM chats WHERE chat_id=$1', [chat_id]);
}

function deleteMessage(message_id) {
    return pool.query('DELETE FROM messages WHERE message_id=$1', [message_id]);
}


function updateUserPassword(newPassword, user_id) {
    return pool.query('UPDATE users SET password=$1 WHERE user_id=$2', [newPassword, user_id]);
}

function updateUserAlias(newAlias, user_id) {
    return pool.query('UPDATE users SET alias=$1 WHERE user_id=$2', [newAlias, user_id]);
}

function updateUserLogin(newLogin, user_id) {
    return pool.query('UPDATE users SET login=$1 WHERE user_id=$2', [newLogin, user_id]);
}

function getContacts(user_id) {
    return pool.query('SELECT chat_id as id, name, \'chat\' as type FROM chats \
        WHERE chat_id IN (SELECT chat_id FROM users_chats WHERE user_id=$1) \
        UNION \
        SELECT DISTINCT dialogs.dialog_id as id, users.alias as name, \'dialog\' as type \
        FROM dialogs \
        INNER JOIN \
            users ON (dialogs.user2_id=users.user_id) \
        WHERE dialogs.user1_id=$1 \
        UNION \
        SELECT DISTINCT dialogs.dialog_id as id, users.alias as name, \'dialog\' as type \
        FROM dialogs \
        INNER JOIN \
        users ON (dialogs.user1_id=users.user_id) \
        WHERE dialogs.user2_id=$1', [user_id]);
}

// TODO: alias of sender instead of id
function getDialogMessages(dialog_id) {
    return pool.query('SELECT m.message_id as id, u.alias as sender, m.text as text, m.date_time as mes_time \
    FROM messages as m \
        INNER JOIN users u ON m.sender_id = u.user_id \
    WHERE m.message_id IN (SELECT message_id FROM dialog_messages WHERE dialog_id=$1)', [dialog_id]);
}

function getChatMessages(chat_id) {
    return pool.query('SELECT m.message_id as id, u.alias as sender, m.text as text, m.date_time as mes_time \
    FROM messages as m \
      INNER JOIN users u ON m.sender_id = u.user_id \
    WHERE message_id IN (SELECT message_id FROM chat_messages WHERE chat_id=$1)', [chat_id]);
}

module.exports = {
    saveUser,
    saveChat,
    saveChatUser,
    saveChatMessage,
    saveDialog,
    saveDialogMessage,
    saveMessage,
    findUser,
    findChat,
    findChatUsers,
    findDialogReceiver,
    findMessage,
    deleteUser,
    deleteChat,
    deleteMessage,
    updateUserPassword,
    updateUserAlias,
    updateUserLogin,
    getContacts,
    getDialogMessages,
    getChatMessages
}