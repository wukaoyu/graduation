const { exec } = require('../db/mysql')

const login = (account, password, identity) => {
    let queryTable
    let sql
    // console.log(identity)
    if (identity === 1) {
        queryTable = 'users'
        sql = `SELECT * FROM users where account='${account}' and password='${password}'`
    }else if (identity === 2) {
        sql = `SELECT * FROM teacher where account='${account}' and password='${password}'`
    }else if (identity === 3) {
        sql = `SELECT a.*, b.className, b.startTime, b.graduationTime FROM student AS a  LEFT JOIN classes AS b ON a.classId=b.id where a.account='${account}' and a.password='${password}'`
    }
    
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