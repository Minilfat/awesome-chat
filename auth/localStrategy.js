const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')
const findUserInDb = require('../db/DBmodule').findUser; 
const insertToDb = require('../db/DBmodule').saveUser;

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


function checkAndRegister(req, email, password, done) {
  findUserInDb(email)
    .then(res => {
      if (res.rowCount > 0) {
        return done(null, 'exists');
      }

      let alias = req.body.alias;
      insertToDb(email, password, alias)
        .then(res => {
          console.log('Row(s) inserted: ' + res.rowCount);
          let user = new User(email, password, alias);
          return done(null, user);
        })
        .catch(err => {
          console.error('Error executing query', err.stack)
          return done(err);
        });
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
      return done(err);
    })
}

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, Object.setPrototypeOf(user, User.prototype))
  });


  passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
      findUser(email, password, (err, user) => {
        if (err) {
          return done(err)
        }
        // User not found
        if (!user) {
          return done(null, false, req.flash('message', 'Invalid password or email'));
        }

        return done(null, user);
      })
    }
  ));

  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
      checkAndRegister(req, email, password, (err, user) => {
        if (err) {
          return done(err);
        }
        // User already exists
        if (user === 'exists') {
          return done(null, false, req.flash('message', 'User already exists'))
        }
        return done(null, user);
      })
    }
  ));

}
