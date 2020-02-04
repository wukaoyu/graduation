const { exec } = require('../db/mysql')

/**
 * 根据条件查询教师账号
 * @param {*} username 用户名 
 * @param {*} createBy 创建者
 * @param {Number} sex 性别 1为男 0为女
 * @param {*} account 账号
 * @param {*} startTime 查询的起始时间
 * @param {*} endTime 查询的结束时间
 */
const queryTeacherAccount = (username, createBy, sex, account, startTime, endTime) => {
    let sql = `SELECT a.id, a.username, a.createBy, a.createTime,a.account, a.sex, b.name AS createName FROM teacher AS a JOIN users AS b WHERE a.createBy=b.id `
    if (username !== undefined) {
        sql += `and a.username like '%${username}%' `
    }
    if (createBy !== undefined) {
        sql += `and a.createBy like '%${createBy}%' `
    }
    if (sex !== undefined) {
        sql += `and a.sex=${sex}`
    }
    if (account !== undefined) {
        sql += `and a.account like '%${account}%' `
    }
    if (startTime !== undefined && endTime !==undefined) {
        sql += `and a.createTime BETWEEN ${startTime} AND ${endTime} `
    }
    console.log(sql)
    return exec(sql).then(row => {
        return row || []
    })
}

/**
 * 查询所有管理员
 */
const queryAllAdmin = () => {
    let sql = `SELECT id, username, name, createBy, createTime, createName FROM users`
    return exec(sql).then(row => {
        return row || []
    })
}

module.exports = {
    queryTeacherAccount,
    queryAllAdmin
}