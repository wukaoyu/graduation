const { exec } = require('../../db/mysql')

/**
 * 查询班级账号分页数据
 * @param {String} className 班级名称
 * @param {Number} pageSize 每页显示的条数
 * @param {Number} current 当前第几页
 */
const queryClassesPage = (className, pageSize, current) => {
  let sql = `SELECT * FROM 
	          (SELECT a.*, b.username as teacherName, b.headPortraitUrl FROM classes AS a LEFT JOIN teacher AS b ON a.mainTeacher=b.id) informTab LEFT JOIN
	          (SELECT c.classId, count(c.classId) AS studentCount FROM classes AS a LEFT JOIN teacher AS b ON a.mainTeacher=b.id left JOIN student as c ON c.classId=a.id GROUP BY c.classId) countTab 
            on informTab.id = countTab.classId WHERE 1=1 `
  let countSql = `select count (*) from classes`
  if (className) {
    sql += `and className like '%${className}%' `
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0]['count (*)']
    return num
  })
  return exec(sql).then(row => {
    let rowData = row || []
    let resultData = {
      row: rowData,
      count: count
    }
    return resultData
  })
}

/**
 * 根据班级id查询班级信息
 * @param {Number} 班级id
 */
const queryClassId = (id) => {
  let sql = `SELECT a.* , b.username AS teacherName FROM classes AS a LEFT JOIN teacher AS b ON a.mainTeacher=b.id where a.id=${id}`
  return exec(sql).then(row => {
    return row[0] || {}
  })
}

/**
 * 添加班级
 * @param {*} className 班级名称
 * @param {*} createTime 创建时间
 * @param {*} createBy 创建者
 * @param {*} startTime 开始时间
 * @param {*} graduationTime 毕业时间
 * @param {*} mainTeacher 班主任
 */
const insertClasses = (className, createTime, createBy, startTime, graduationTime, mainTeacher) => {
  let sql = `INSERT INTO classes (className, createTime, createBy, startTime, graduationTime, mainTeacher) VALUES ('${className}', '${createTime}', ${createBy}, '${startTime}', '${graduationTime}', '${mainTeacher}')`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 修改班级信息
 * @param {*} id 班级id
 * @param {*} className 班级名称
 * @param {*} startTime 开学时间
 * @param {*} graduationTime 毕业时间
 * @param {*} mainTeacher 班主任id
 */
const upDataClasses = (id, className, startTime, graduationTime, mainTeacher) => {
  let sql = `UPDATE classes SET className = '${className}', startTime = '${startTime}', graduationTime='${graduationTime}', mainTeacher='${mainTeacher}'  WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除班级
 * @param {*} id 班级id
 */
const deleteClasses = (id) => {
  let sql = `DELETE FROM classes WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 查询全部班级
 */
const queryAllClass = () => {
  let sql = `SELECT * FROM classes`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 查询学生账号分页信息
 * @param {String} account 学生账号
 * @param {Number} classId 班级id
 * @param {String} username 学生姓名
 * @param {Number} sex 学生性别 1为男 0为女
 * @param {Number} pageSize 每页显示的条数
 * @param {Number} current 当前第几页
 */
const queryStudentPage = (account, classId, username, sex, pageSize, current) => {
  let sql = `SELECT a.id, a.account, a.createTime, a.sex, a.username,a.classId, b.className FROM student as a LEFT JOIN classes as b on a.classId=b.id 
            where 1=1 `
  let countSql = `select count (*) from student`
  if (account) {
    sql += `and account like '%${account}%' `
  }
  if (classId) {
    sql += `and classId=${classId} `
  }else if (classId === 0) {
    sql += `and b.className IS NULL `
  }
  if (username) {
    sql += `and username like '%${username}%' `
  }
  if (sex !== undefined && sex !== '' && sex !== null) {
    sql += `and sex=${sex}`
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0]['count (*)']
    return num
  })
  return exec(sql).then(row => {
    let rowData = row || []
    let resultData = {
      row: rowData,
      count: count
    }
    return resultData
  })
}

/**
 * 添加学生账号
 * @param {String} account 学生账号
 * @param {String} password 密码
 * @param {Number} createBy 创建者
 * @param {String} createTime 创建时间
 * @param {Number} classId 班级id
 * @param {String} username 学生姓名
 * @param {Number} sex 性别
 * @param {Number} identity 身份
 * @param {Number} createIdentity 创建者身份
 */
const insertStudent = (account, password, createBy, createTime, classId, username, sex, identity, createIdentity) => {
  let querySql = `SELECT * from student where account = '${account}'`
  let isHaveAccount = exec(querySql).then(row => {
      if (row.length > 0) {
          return false
      }else {
          return true
      }
  })
  return isHaveAccount.then(data => {
    if (data) {
      let sql = `INSERT INTO student (account, password, createBy, createTime, classId, username, sex, identity, createIdentity)
                VALUES ('${account}', '${password}', ${createBy}, '${createTime}', ${classId}, '${username}', ${sex}, ${identity}, ${createIdentity})`
      return exec(sql).then(row => {
        return row || {}
      })
    }else {
      return '该账号已存在'
    }
  })
}

/**
 * 修改学生信息
 * @param {Number} classId 班级id
 * @param {Number} sex 性别
 * @param {String} username 姓名
 * @param {String} account 账号
 * @param {Number} id 学生id
 */
const upDataStudent = (classId=null, sex, username, account, id) => {
  let sql = `UPDATE student SET classId = ${classId}, sex = ${sex}, username='${username}', account='${account}' WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除学生账号
 * @param {*} id 学生id
 */
const deleteStudent = (id) => {
  let sql = `DELETE FROM student WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 根据id查询学生信息
 * @param {*} id 
 */
const queryStudentId = (id) => {
  let sql = `SELECT a.*, b.className FROM student as a LEFT JOIN classes as b ON a.classId=b.id WHERE a.id=${id}`
  return exec(sql).then(row => {
    return row[0] || {}
  })
}

module.exports = {
  queryClassesPage,
  insertClasses,
  queryStudentPage,
  queryClassId,
  upDataClasses,
  deleteClasses,
  queryAllClass,
  upDataStudent,
  deleteStudent,
  insertStudent,
  queryStudentId
}