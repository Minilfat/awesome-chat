const bCrypt = require('bcrypt-nodejs');

const updatePasswd = require('../db/DBmodule').updateUserPassword;
const updateAlias = require('../db/DBmodule').updateUserAlias;

function passwordsEqual(rawPasswd, hashPasswd){
    return bCrypt.compareSync(rawPasswd, hashPasswd);
}

function getHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function checkResult(result) {
    console.info("Rows fetched: " + result.rowCount);
    return result.rowCount > 0;
}
  

function changePassword(req, resp, done) {

    let oldPswd = req.body.oldPswd;
    let newPswd = req.body.newPswd;
    let user = req.user;

    if (passwordsEqual(oldPswd, user.password)) {
        let hashedNewPswd = getHash(newPswd);
        updatePasswd(hashedNewPswd, user.id)
            .then(res => {
                if (checkResult(res)) {
                    console.log('Password for user ' + user.id + ' was updated');
                    user.password = hashedNewPswd;
                    return done(null, user);
                }
                return done(null);
            })
            .catch(err => {
                console.error('Error executing query', err.stack)
                return done(err);
            });
    }
}


function changeAlias(req, resp, done) {

    let newAlias = req.body.newAlias;
    let user = req.user;

    
    updatePasswd(newAlias, user.id)
        .then(res => {
            if (checkResult(res)) {
                console.log('Alias for user ' + user.id + ' was updated');
                user.alias = newAlias;
                return done(null, user);
            }
            return done(null);
        })
        .catch(err => {
            console.error('Error executing query', err.stack)
            return done(err);
        });
    
}

module.exports = {
    changePassword,
    changeAlias
}

// module.exports = (req, res, next) => {

// }