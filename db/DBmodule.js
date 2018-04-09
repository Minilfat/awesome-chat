const config = require('config');

const { Pool, Client } = require('pg');
const pool = new Pool(config.get('db'));

pool.connect();

const createUsers = pool.query('CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, login VARCHAR(50) UNIQUE NOT NULL, password CHAR(60) NOT NULL, alias VARCHAR(50) NOT NULL)');
const createChats = pool.query('CREATE TABLE IF NOT EXISTS chats (chat_id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, participants INTEGER NOT NULL)');
const createMessages = pool.query('CREATE TABLE IF NOT EXISTS messages (message_id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users ON DELETE CASCADE, text TEXT NOT NULL, date_time TIMESTAMP NOT NULL)');
const createUsersChats = pool.query('CREATE TABLE IF NOT EXISTS users_chats (users_chats_id  SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');
const createMessagesChats = pool.query('CREATE TABLE IF NOT EXISTS messages_chats (messages_chats_id  SERIAL PRIMARY KEY, message_id INTEGER REFERENCES messages ON DELETE CASCADE, chat_id INTEGER REFERENCES chats ON DELETE CASCADE)');

function saveUser(login, password, alias) {
    return pool.query('INSERT INTO users(login, password, alias) VALUES($1, $2, $3) RETURNING user_id', [login, password, alias]);
}

function saveChat(name, participants=1) {
    return pool.query('INSERT INTO chats(name, participants) VALUES($1, $2) RETURNING chat_id', [name, participants]);
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