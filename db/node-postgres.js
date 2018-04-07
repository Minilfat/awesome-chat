const config = require('config');

const { Pool, Client } = require('pg');
const pool = new Pool(config.get('db'));

pool.connect();
const createUsers = pool.query('CREATE TABLE IF NOT EXISTS users (login VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, alias VARCHAR(50))');
const createChats = pool.query('CREATE TABLE IF NOT EXISTS chats (name VARCHAR(50) NOT NULL, participants INTEGER NOT NULL)');

function addUser(login, password, alias=null) {
    pool.query('INSERT INTO users VALUES($1, $2, $3)', [login, password, alias]);
}

function addChat(name, participants=1) {
    pool.query('INSERT INTO chats VALUES($1, $2)', [name, participants]);
}