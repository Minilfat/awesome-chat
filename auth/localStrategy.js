const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

const user = {
    email: 'qwe@a.ru',
    password: 'test',
    display: function() {
        return this.email + ' ' + this.password;
    }
}


function findUser(email, callback) {
    if (email === user.email) {
      return callback(null, user)
    }
    return callback(null)
}

module.exports = function(passport) {
  passport.serializeUser(function (user, cb) {
    cb(null, user.email)
  });

  passport.deserializeUser(function (email, cb) {
    findUser(email, cb)
  })


  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
      findUser(email, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          return done(null, false, {message: 'Wrong username or password!'})
        }

        return done(null, user);
      })
    }
  ));
}