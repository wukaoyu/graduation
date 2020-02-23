const { exec } = require('../../db/mysql')

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
    let sql = `SELECT a.id, a.username, a.createBy, a.createTime,a.account, a.sex, b.username AS createName FROM teacher AS a JOIN users AS b WHERE a.createBy=b.id `
    if (username !== undefined) {
        sql += `and a.username like '%${username}%' `
    }
    if (createBy !== undefined) {
        sql += `and a.createBy like '%${createBy}%' `
    }
    if (sex !== undefined && sex !== '') {
        sql += `and a.sex=${sex} `
    }
    if (account !== undefined) {
        sql += `and a.account like '%${account}%' `
    }
    if (startTime !== undefined && endTime !==undefined) {
        sql += `and a.createTime BETWEEN '${startTime}' AND '${endTime}' `
    }
    // console.log(sql)
    return exec(sql).then(row => {
        return row || []
    })
}

/**
 * 查询所有管理员
 */
const queryAllAdmin = () => {
    let sql = `SELECT id, username, account, createBy, createTime, createName FROM users`
    return exec(sql).then(row => {
        return row || []
    })
}

/**
 * 增加教师账号
 * @param {String} username 姓名 
 * @param {String} password 密码
 * @param {Number} createBy 创建人的id
 * @param {String} createTime 创建时间
 * @param {Number} identity 身份
 * @param {Number} account 账号
 * @param {Number}} sex 性别 1为男，0为女
 */
const insertTeacherAccount = (username, password, createBy, createTime, identity, account, sex) => {
    let querySql = `SELECT * from teacher where account = '${account}'`
    let isHaveAccount = exec(querySql).then(row => {
        if (row.length > 0) {
            return false
        }else {
            return true
        }
    })
    return isHaveAccount.then(data => {
        // console.log(data)
        if (data) {
            let sql = `INSERT INTO teacher (username, password, createBy, createTime, identity, account, sex) VALUES ('${username}', '${password}', ${createBy}, '${createTime}', ${identity}, '${account}', ${sex})`
            return exec(sql).then(row => {
                return row || {}
            })
        }else {
            return '该账号已存在'
        }
    })
}
/**
 * 更新教师账号
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} account 账号
 * @param {Number} sex 性别
 * @param {Number} id 更改的ID
 */
const updataTeacherAccount = (username, password, account, sex, id) => {
    let sql = `UPDATE teacher SET username='${username}', password = '${password}', account='${account}', sex=${sex}  WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}
/**
 * 删除教师账号
 * @param {*} id 删除的教师id
 */
const deleteTeacherAccount = (id) => {
    let sql = `DELETE FROM teacher WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}


/**
 * 根据条件查询管理员账号
 * @param {*} username 用户名 
 * @param {*} createBy 创建者
 * @param {Number} sex 性别 1为男 0为女
 * @param {*} account 账号
 * @param {*} startTime 查询的起始时间
 * @param {*} endTime 查询的结束时间
 */
const queryAdminAccount = (username, createBy, sex, account, startTime, endTime) => {
    let sql = `SELECT id, username, createName, createTime, account, sex FROM users WHERE 1=1 `
    if (username !== undefined) {
        sql += `and username like '%${username}%' `
    }
    if (createBy !== undefined) {
        sql += `and createBy like '%${createBy}%' `
    }
    if (sex !== undefined && sex !== '') {
        sql += `and sex=${sex} `
    }
    if (account !== undefined) {
        sql += `and account like '%${account}%' `
    }
    if (startTime !== undefined && endTime !==undefined) {
        sql += `and createTime BETWEEN '${startTime}' AND '${endTime}' `
    }
    // console.log(sql)
    return exec(sql).then(row => {
        return row || []
    })
}

/**
 * 增加教师账号
 * @param {String} username 姓名 
 * @param {String} password 密码
 * @param {Number} createBy 创建人的id
 * @param {String} createName 创建人的姓名
 * @param {String} createTime 创建时间
 * @param {Number} identity 身份
 * @param {Number} account 账号
 * @param {Number} sex 性别 1为男，0为女
 */
const insertAdminAccount = (username, password, createBy, createName, createTime, identity, account, sex) => {
    let querySql = `SELECT * from users where account = '${account}'`
    let isHaveAccount = exec(querySql).then(row => {
        if (row.length > 0) {
            return false
        }else {
            return true
        }
    })
    return isHaveAccount.then(data => {
        if (data) {
            let sql = `INSERT INTO users (username, password, createBy, createName, createTime, identity, account, sex) VALUES ('${username}', '${password}', ${createBy}, '${createName}', '${createTime}', ${identity}, '${account}', ${sex})`
            return exec(sql).then(row => {
                return row || {}
            })
        }else {
            return '该账号已存在'
        }
    })
}
/**
 * 更新教师账号
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} account 账号
 * @param {Number} sex 性别
 * @param {Number} id 更改的ID
 */
const updataAdminAccount = (username, password, account, sex, id) => {
    let sql = `UPDATE users SET username='${username}', password = '${password}', account='${account}', sex=${sex}  WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}
/**
 * 删除教师账号
 * @param {*} id 删除的教师id
 */
const deleteAdminAccount = (id) => {
    let sql = `DELETE FROM users WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}
module.exports = {
    queryTeacherAccount,
    queryAllAdmin,
    insertTeacherAccount,
    updataTeacherAccount,
    deleteTeacherAccount,
    queryAdminAccount,
    insertAdminAccount,
    updataAdminAccount,
    deleteAdminAccount
}