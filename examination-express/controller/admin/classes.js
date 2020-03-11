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

module.exports = {
  queryClassesPage,
  insertClasses
}