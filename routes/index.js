'use strict';

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired')
const passport = require('passport');


module.exports = (app) => {

    app.get('/', (req, res) => res.render('index', {...res.locals}));
    app.get('/login', (req, res) => res.render('index', {...res.locals}));

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/chats',
            failureRedirect: '/fail'
        })
    });

    app.get('/fail', (req, res) => res.send(401, {success : false, message : 'authentication failed' }))

    app.all('/chats/*', authRequired, (req,res) => {
        res.render('test', {username: req.session.user});
    });
    // app.all('chats/*', authRequired);
};
