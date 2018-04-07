'use strict';

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired')
const passport = require('passport');


module.exports = (app) => {

    app.get('/', (req, res) => res.render('index', {...res.locals}));
    app.get('/login', (req, res) => res.render('index', {...res.locals}));

    app.post('/login', passport.authenticate('local', {
            successRedirect: '/chat',
            failureRedirect: '/contact-list'
        }));
    

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
};