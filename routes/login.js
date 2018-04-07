'use strict';
const passport = require('../auth/init');

module.exports = app => {
    app.get('/login', (req, res) => {
        res.render('login', {...res.locals});
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/checklogin',
        failureRedirect: '/'
    }));

    app.get('/checklogin', passport.authenticationMiddleware(), (req, res) => {
        res.render('test', {username: 'logged'});
    });
};
