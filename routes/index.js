'use strict';

const {error404} = require('../controllers/errors');
const authRequired = require('../middlewares/isAuthRequired');
const login = require('../controllers/login');
const logout = require('../controllers/logout');


module.exports = (app) => {

    app.get('/', (req, res) => res.render('index', {...res.locals}));


    app.get('/login', (req, res) => res.render('index', {...res.locals}));
    app.post('/login', login(), (req, res) => res.redirect('chat')); 
    app.get('/logout', (req, res) => logout(req,res));

    app.get('/register', (req, res) => res.render('register', {...res.locals}));
    app.post('/register', (req, res) => res.render('register', {...res.locals}));

    app.get('/contact-list', (req, res) => res.render('contact-list', {...res.locals}));

    app.get('/contact', (req, res) => res.render('contact', {...res.locals}));

    // по этомму маршруту может пройти только авторизованный пользователь
    app.get('/chat', authRequired(), (req, res) => {
        res.render('chat', {username: req.user.display()});
    });

    
};