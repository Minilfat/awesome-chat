const getContacts = require('../db/DBmodule').getContacts;
const Contact = require('../models/Contact');

function checkResult(result) {
    console.info("Rows fetched: " + result.rowCount);
    return result.rowCount > 0;
}

module.exports = (req, resp) => {
    getContacts(req.user.id)
        .then(result => {
            if (checkResult(result)) {
                let contacts = [];
                result.rows.map(row => contacts.push(new Contact(row.id, row.name, row.type)));
                resp.send(JSON.stringify(contacts));
            } else {
                resp.send(JSON.stringify({}));
            }
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            return done(err);
        })
    
}