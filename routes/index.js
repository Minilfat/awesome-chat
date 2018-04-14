'use strict';

const passport = require('passport');

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired');
const isMobile = require('../middlewares/isMobile');
const logout = require('../controllers/logout');
const changePassword = require('../controllers/profileEditor').changePassword;
const changeAlias = require('../controllers/profileEditor').changeAlias;
const changeEmail = require('../controllers/profileEditor').changeEmail;
const getContacts = require('../controllers/contacts');
const getMessages = require('../controllers/messages');
const saveChatUser = require('../db/DBmodule').saveChatUser;



module.exports = (app) => {

    app.get('/', (req, res) => res.render('index', {message: req.flash('message')}));


    app.get('/login', (req, res) => res.render('index', {message: req.flash('message')}));
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/contact-list',
        failureRedirect: '/',
        failureFlash : true
    }));
    app.get('/logout', (req, res) => logout(req,res));

    app.get('/register', (req, res) => res.render('register', {message: req.flash('message')}));
    app.post('/register', passport.authenticate('register', {
        successRedirect: '/contact-list',
        failureRedirect: '/register',
        failureFlash : true
    }));

    app.get('/contact', (req, res) => res.render('contact', {...res.locals}));

    app.get('/profile', authRequired(), (req, res) => res.render('profile', {alias: req.user.alias,
                                                                             email: req.user.login}));

    app.post('/user/changePassword', authRequired(), (req, res) => {
        changePassword(req, res, (err, user) => {
            if (err) {
                console.log('error happened');
            }
            if (user) {
                res.render('chat', {username: user.password});
            }

        })
    });

    // тестовые пути для проверки работоспособности смены фалиаса и мэйла
    // to be deleted soon :)
    app.get('/alias', authRequired(), (req, res) => res.render('aliasChangeTest'));
    app.get('/email', authRequired(), (req, res) => res.render('emailChangeTest'));

    app.post('/user/changeAlias', authRequired(), (req, res) => {
        changeAlias(req, res, (err, user) => {
            if (err) {
                console.log('error happened');
            }
            if (user) {
                res.redirect('/profile');
            }

        });
    });

    app.get('/contact-list', authRequired(), (req, res) =>  {
        if (!isMobile(req)) {
            res.render('contact-list', {user: req.user.id, name: req.user.alias});
        } else {
            res.render('mob-contacts', {user: req.user.id, name: req.user.alias});
            console.log('device is mobile');
        }

    });

    app.get('/contacts', authRequired(), (req, res) => {
        getContacts(req,res);
    });

    app.post('/messages', authRequired(), (req, res) => {
        getMessages(req,res);
    });



    app.post('/user/changeEmail', authRequired(), (req, res) => {
        changeEmail(req, res, (err, user) => {
            if (err) {
                console.log('error happened');
            }
            if (user) {
                res.redirect('/profile');
            }

        })
    });

    app.post('/newChatUser', authRequired(), (req, res) => {
        let alias = req.body.alias;
        let chat_id = req.body.chat_id;
        saveChatUser(alias, chat_id)
            .then(result => {
                console.log('Row(s) inserted: ' + res.rowCount);
                res.redirect('/contact-list');
            })
            .catch(err => {
                console.log('Error happened: ', err);
            })
    });

    app.post('/createDialog', authRequired(), (req, res) => {
        let alias = req.body.alias;
        let chat_id = req.body.chat_id;
        saveChatUser(alias, chat_id)
            .then(result => {
                console.log('Row(s) inserted: ' + res.rowCount);
                res.redirect('/contact-list');
            })
            .catch(err => {
                console.log('Error happened: ', err);
            })
    });

    

};