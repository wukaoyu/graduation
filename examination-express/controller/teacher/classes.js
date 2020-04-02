const { exec } = require('../../db/mysql')

/**
 * 查询我管理的班级分页数据
 * @param {String} className 班级名称
 * @param {Number} pageSize 每页显示的条数
 * @param {Number} current 当前第几页
 */
const queryMainClassPage = (className, pageSize, current) => {
  let teacherId = global.userInfo.id
  let sql = `SELECT * FROM 
	(SELECT a.*, b.username as teacherName, b.headPortraitUrl FROM classes AS a LEFT JOIN teacher AS b ON a.mainTeacher=b.id WHERE a.mainTeacher=${teacherId}) informTab LEFT JOIN
	(SELECT c.classId, count(c.classId) AS studentCount FROM classes AS a LEFT JOIN teacher AS b ON a.mainTeacher=b.id left JOIN student as c ON c.classId=a.id GROUP BY c.classId) countTab 
	on informTab.id = countTab.classId WHERE 1=1 `
  let countSql = `select count (*) from classes where mainTeacher=${teacherId} `
  if (className) {
    sql += `and informTab.className like '%${className}%' `
  }

  if (pageSize && current) {
    sql += `limit ${(current - 1) * pageSize},${pageSize} `
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


module.exports = {
  queryMainClassPage
}