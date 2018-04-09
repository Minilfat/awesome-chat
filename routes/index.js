'use strict';

const passport = require('passport');

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired');
const logout = require('../controllers/logout');



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

    // по этомму маршруту может пройти только авторизованный пользователь
    app.get('/chat', authRequired(), (req, res) => {
        res.render('chat', {username: req.user.getLogin(), 
                            info: req.user.display()});
    });

    
};