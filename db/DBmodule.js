const config = require('config');

const { Pool, Client } = require('pg');
const pool = new Pool(config.get('db'));

pool.connect();
const createUsers = pool.query('CREATE TABLE IF NOT EXISTS users (login VARCHAR(50) PRIMARY KEY, password VARCHAR(50) NOT NULL, alias VARCHAR(50))');
const createChats = pool.query('CREATE TABLE IF NOT EXISTS chats (chat_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, participants INTEGER NOT NULL)');
const createMessages = pool.query('CREATE TABLE IF NOT EXISTS messages (message_id SERIAL PRIMARY KEY, login VARCHAR(50) REFERENCES users ON DELETE CASCADE, text TEXT NOT NULL, date_time TIMESTAMP NOT NULL)');
const createUsersChats = pool.query('CREATE TABLE IF NOT EXISTS users_chats (login VARCHAR(50) REFERENCES users ON DELETE CASCADE, chat_id REFERENCES chats ON DELETE CASCADE)');
const createMessagesChats = pool.query('CREATE TABLE IF NOT EXISTS messages_chats (message_id INTEGER REFERENCES messages ON DELETE CASCADE, chat_id REFERENCES chats ON DELETE CASCADE)');

function saveUser(login, password, alias=null) {
    return pool.query('INSERT INTO users VALUES($1, $2, $3)', [login, password, alias]);
}

function saveChat(name, participants=1) {
    return pool.query('INSERT INTO chats VALUES($1, $2)', [name, participants]);
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

module.exports = {
    saveUser,
    saveChat,
    saveMessage,
    findUser,
    findChat,
    findMessage,
    deleteUser,
    deleteChat,
    deleteMessage
}