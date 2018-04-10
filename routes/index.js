'use strict';

const passport = require('passport');

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired');
const logout = require('../controllers/logout');
const changePassword = require('../controllers/profileEditor').changePassword;
const changeAlias = require('../controllers/profileEditor').changeAlias;
const changeEmail = require('../controllers/profileEditor').changeEmail;



module.exports = (app) => {

    app.get('/', (req, res) => res.render('index', {message: req.flash('message')}));


    app.get('/login', (req, res) => res.render('index', {message: req.flash('message')}));
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/chat',
        failureRedirect: '/',
        failureFlash : true
    }));
    app.get('/logout', (req, res) => logout(req,res));

    app.get('/register', (req, res) => res.render('register', {message: req.flash('message')}));
    app.post('/register', passport.authenticate('register', {
        successRedirect: '/chat',
        failureRedirect: '/register',
        failureFlash : true
    }));

    app.get('/contact-list', (req, res) => res.render('contact-list', {...res.locals}));

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

        })
    });

    app.get('/contact-list', function (req, res) {
        res.locals.contacts = ['Lidiya', 'Zakir', 'Zufar', 'Ilfat', 'Marat'];
        res.render('contact-list', {...res.locals})
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

    app.get('/contact', function (req, res) {
        res.render('contact', {...res.locals});
    });

    app.get('/chat', function (req, res) {
        res.render('chat', {...res.locals});
    });
    // по этомму маршруту может пройти только авторизованный пользователь
    app.get('/chat', authRequired(), (req, res) => {
        res.render('chat', {
            username: req.user.password,
            info: req.user.id
        });
    });

    app.get('/register', function (req, res) {
        res.render('register', {...res.locals});
    });
};