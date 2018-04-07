'use strict';

const path = require('path');
const join = path.join;

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const pug = require('pug');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');


const indexRoute = require('./routes/index');
const commonData = require('./middlewares/common-data');

const db = require('./db/DBmodule');
const app = express();

// Подключаем шаблонизатор
app.set('view engine', 'pug');
// Подключаем директорию с шаблонами
app.set('views', join(__dirname, 'views'));

// Логируем запросы к приложению в debug-режиме
if (config.get('debug')) {
    app.use(morgan('dev'));
}

// Отдаём статичные файлы из соответствующей директории,
// но только локально, а в бою используем CDN
if (process.env.NODE_ENV === 'development') {
    app.use(express.static(join(__dirname, 'public')));
}

// Разбираем тело POST запроса
// Запрос приходит в urlencoded формате (обычный для HTML форм)
app.use(bodyParser.urlencoded({
    extended: true
}));

// Выводим ошибку, если не смогли разобрать POST запрос, и продолжаем работу
app.use((err, req, res, next) => {
    console.error(err.stack);
    next();
});


require('./auth/localStrategy')(passport);

// настройка авторизации с использованием passport js
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Собираем общие данные для всех страниц приложения
app.use(commonData);

// Подключаем маршруты
indexRoute(app);


// Фиксируем фатальную ошибку и отправляем ответ с кодом 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(500);
});

app.listen(config.get('port'), () => {
    console.info(`Open http://localhost:${config.get('port')}/`);
});

module.exports = app;
