const { exec } = require('../db/mysql')

const login = (username, password) => {
    let sql = `SELECT * FROM users where username='${username}' and password='${password}'`
    return exec(sql).then(row => {
        return row[0] || {}
    })
}
const queryAllUsers = () => {
    let sql = `SELECT * FROM users`
    return exec(sql).then(row => {
        return row || {}
    })
}
module.exports = {
    login,
    queryAllUsers
}