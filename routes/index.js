'use strict';

const {error404} = require('../controllers/errors');

module.exports = app => {
    app.get('/', function (req, res) {
        res.render('index', {...res.locals});
    });

    app.get('/chat', function (req, res) {
        res.render('chat', {...res.locals});
    });

    app.get('/register', function (req, res) {
        res.render('register', {...res.locals});
    });
};
