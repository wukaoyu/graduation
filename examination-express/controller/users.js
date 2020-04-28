const { exec } = require('../db/mysql')

const login = (account, password, identity) => {
    let queryTable
    let sql
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

/**
 * 修改个人信息
 * @param {*} username 姓名
 * @param {*} sex 性别
 * @param {*} headPortraitUrl 头像
 */
const updataPersonal = (username, sex, headPortraitUrl) => {
    let id = global.userInfo.id
    let identity = global.userInfo.identity
    let identityName = ''
    if (identity === 1) {
        identityName = 'users'
    }else if (identity === 2) {
        identityName = 'teacher'
    }else if (identity === 3) {
        identityName = 'student'
    }
    let sql = `UPDATE ${identityName} SET `
    if (username) {
        sql += `username='${username}',`
    }
    if (sex > -1) {
        sql += `sex=${sex},`
    }
    if (headPortraitUrl) {
        sql += `headPortraitUrl='${headPortraitUrl}',`
    }
    sql = sql.substring(0, sql.length - 1)
    sql += ` WHERE id = ${id}`
    return exec(sql).then(row => {
        if (row) {
            let personSql
            if (identity === 1) {
                queryTable = 'users'
                personSql = `SELECT * FROM users where id=${id}`
            }else if (identity === 2) {
                personSql = `SELECT * FROM teacher where id=${id}`
            }else if (identity === 3) {
                personSql = `SELECT a.*, b.className, b.startTime, b.graduationTime FROM student AS a  LEFT JOIN classes AS b ON a.classId=b.id where a.id=${id}`
            }
            return exec(personSql).then(row => {
                return row[0] || {}
            })
        }
        return {}
    })
}

/**
 * 修改密码
 * @param {*} oldPassword 旧密码
 * @param {*} newPassword 新密码
 */
const updataPassword = (oldPassword, newPassword) => {
    let id = global.userInfo.id
    let identity = global.userInfo.identity
    let identityName = ''
    if (identity === 1) {
        identityName = 'users'
    }else if (identity === 2) {
        identityName = 'teacher'
    }else if (identity === 3) {
        identityName = 'student'
    }
    let passwordSql = `SELECT * FROM ${identityName} where id = ${id}`
    let sql = `UPDATE ${identityName} SET password = ${newPassword} where id = ${id}`
    let sqlOldPassword = exec(passwordSql).then(row => {
        return row[0].password || ''
    })
    return sqlOldPassword.then(sqlOldPassword => {
        if (sqlOldPassword === oldPassword) {
            return exec(sql).then(row => {
                return '修改成功'
            })
        }else {
            return false
        }
    })
}

module.exports = {
    login,
    queryAllUsers,
    updataPersonal,
    updataPassword
}