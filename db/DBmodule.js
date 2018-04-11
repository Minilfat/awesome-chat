const config = require('config');

const { Pool, Client } = require('pg');
const pool = new Pool(config.get('db'));

pool.connect();

// const clean = pool.query('DROP TABLE users, chats, messages, users_chats, messages_chats;');

const createUsers = pool.query('CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, login VARCHAR(50) UNIQUE NOT NULL, password CHAR(60) NOT NULL, alias VARCHAR(50) NOT NULL)');
const createChats = pool.query('CREATE TABLE IF NOT EXISTS chats (chat_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL)');
const createMessages = pool.query('CREATE TABLE IF NOT EXISTS messages (message_id SERIAL PRIMARY KEY, sender_id INTEGER REFERENCES users ON DELETE CASCADE, text TEXT NOT NULL, date_time TIMESTAMP NOT NULL)');
const createUsersChats = pool.query('CREATE TABLE IF NOT EXISTS users_chats (user_id INTEGER REFERENCES users ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');
const createChatMessages = pool.query('CREATE TABLE IF NOT EXISTS chat_messages (message_id INTEGER REFERENCES messages ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');
const createDialogs = pool.query('CREATE TABLE IF NOT EXISTS dialogs (dialog_id SERIAL PRIMARY KEY, user1_id INTEGER REFERENCES users ON DELETE CASCADE, user2_id INTEGER REFERENCES users ON DELETE CASCADE)');
const createDialogMessages = pool.query('CREATE TABLE IF NOT EXISTS dialog_messages (dialog_id INTEGER REFERENCES dialogs ON DELETE CASCADE, message_id INTEGER REFERENCES messages ON DELETE CASCADE)');



function saveUser(login, password, alias) {
    return pool.query('INSERT INTO users(login, password, alias) VALUES($1, $2, $3) RETURNING user_id', [login, password, alias]);
}

function saveChat(name) {
    return pool.query('INSERT INTO chats(name) VALUES($1) RETURNING chat_id', [name]);
}

function saveMessage(login, text='', date_time=0) {
    return pool.query('INSERT INTO messages VALUES($1, $2, $3)', [login, text, date_time]);
}


function findUser(login) {
    return pool.query('SELECT * FROM users WHERE login=$1', [login]);
}


function findChat(chat_id) {
    return pool.query('SELECT * FROM chats WHERE chat_id=$1', [chat_id]);
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

module.exports = {
    saveUser,
    saveChat,
    saveMessage,
    findUser,
    findChat,
    findMessage,
    deleteUser,
    deleteChat,
    deleteMessage,
    updateUserPassword,
    updateUserAlias,
    updateUserLogin,
    getContacts
}