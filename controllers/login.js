const passport = require('passport');
module.exports = function() {
    return passport.authenticate('local');
};