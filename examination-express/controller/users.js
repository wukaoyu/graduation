const { exec } = require('../db/mysql')

const login = (username, password, identity) => {
    let queryTable
    // console.log(identity)
    if (identity === 1) {
        queryTable = 'users'
    }else if (identity === 2) {
        queryTable = 'teacher'
    }else if (identity === 3) {
        queryTable = 'student'
    }
    let sql = `SELECT * FROM ${queryTable} where username='${username}' and password='${password}'`
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