'use strict';

const {error404} = require('../controllers/errors');

module.exports = app => {
    app.get('/', function (req, res) {
        res.render('index', {...res.locals});
    });

    app.get('/contacts', function (req, res) {
        res.render('contacts', {...res.locals});
    });
};
