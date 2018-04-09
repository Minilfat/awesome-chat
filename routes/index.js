'use strict';

const {error404} = require('../controllers/errors');

module.exports = app => {
    app.get('/', function (req, res) {
        res.render('index', {...res.locals});
    });

    app.get('/contact-list', function (req, res) {
        res.render('contact-list', {...res.locals});
    });

    app.get('/contact', function (req, res) {
        res.render('contact', {...res.locals});
    });

    app.get('/chat', function (req, res) {
        res.render('chat', {...res.locals});
    });

    app.get('/register', function (req, res) {
        res.render('register', {...res.locals});
    });

    app.get('/profile', function (req, res) {
        res.render('profile', {...res.locals});
    });

    /* Mobile version*/

    app.get('/mob-contact-list', function (req, res) {
        res.render('mob-contact-list', {...res.locals});
    });

    app.get('/mob-chat', function (req, res) {
        res.render('mob-chat', {...res.locals});
    });
};