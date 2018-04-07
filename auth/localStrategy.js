const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')
const findUserInDb = require('../db/DBmodule').findUser; 


function checkResult(result) {
  console.info("Rows fetched: " + result.rowCount);
  return result.rowCount > 0;
}


function findUser(email, password, callback) {
  findUserInDb(email)
    .then(res => {
      if (checkResult(res)) {
          if (email === res.rows[0].login && password === res.rows[0].password) {
            let user = new User(res.rows[0].login,res.rows[0].password,res.rows[0].alias);
            return callback(null, user);
          }
      };
      return callback(null);
    })
    .catch(err =>  {
      console.error('Error executing query', err.stack)
      return callback(err);
    });
}

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, Object.setPrototypeOf(user, User.prototype))
  });


  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
      findUser(email, password, (err, user) => {
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
