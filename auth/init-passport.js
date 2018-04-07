const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

const user = {
    login: 'test',
    password: 'test',
    display: function() {
        return this.login + ' ' + this.password;
    }
}


function findUser(login, callback) {
    if (login === user.login) {
      return callback(null, user)
    }
    return callback(null)
}

module.exports = function(passport) {
  passport.serializeUser(function (user, cb) {
    cb(null, user.login)
  });

  passport.deserializeUser(function (login, cb) {
    findUser(login, cb)
  })


  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (login, password, done) => {
      findUser(login, (err, user) => {
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