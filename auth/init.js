const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const authenticationMiddleware = require('../middlewares/auth-middleware')


const user = {
    login: 'test',
    password: 'test'
}


function findUser (login, callback) {
    if (login === user.login) {
      return callback(null, user)
    }
    return callback(null)
}

passport.serializeUser(function (user, cb) {
    cb(null, user.login)
  })
  
  passport.deserializeUser(function (login, cb) {
    findUser(login, cb)
  })


passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    (login, password, done) => {
      findUser(login, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }

        return done(null, user);
      })
    }
));

passport.authenticationMiddleware = authenticationMiddleware;
module.exports = passport;