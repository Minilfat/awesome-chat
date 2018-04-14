module.exports = req => {
    let ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}