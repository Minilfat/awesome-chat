const Message = require('../models/Message');
const getDialogMessages = require('../db/DBmodule').getDialogMessages;
const getChatMessages = require('../db/DBmodule').getChatMessages;
const isMobile = require('../middlewares/isMobile');

function checkResult(result) {
    console.info("Rows fetched: " + result.rowCount);
    return result.rowCount > 0;
}

module.exports = (req, resp) => {

    // console.log(req.body.id)
    // console.log('Type: ' + req.body.type);
    // console.log(req.user.id)
    if (isMobile(req)) {
        
    }

    if (req.body.type === 'dialog') {
        getDialogMessages(req.body.id)
            .then(result => {
                if (checkResult(result)) {
                    let messages = [];
                    result.rows.map(row => messages.push(new Message(row.id, row.sender, row.text, row.mes_time)));
                    resp.send(JSON.stringify(messages));
                } else {
                    resp.send(JSON.stringify([]));
                }
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                // return done(err);
            })
    } else if (req.body.type === 'chat') {
        getChatMessages(req.body.id)
            .then(result => {
                if (checkResult(result)) {
                    let messages = [];
                    result.rows.map(row => messages.push(new Message(row.id, row.sender, row.text, row.mes_time)));
                    resp.send(JSON.stringify(messages));
                } else {
                    resp.send(JSON.stringify([]));
                }
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                // return done(err);
            })
    }
}