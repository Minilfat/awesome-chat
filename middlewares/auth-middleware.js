function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log('qwewqeq');
            return next();
        }
        res.redirect('/login')
    }
}

module.exports = authenticationMiddleware;