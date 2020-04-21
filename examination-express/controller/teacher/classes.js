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

/**
 * 查询每个班级的所有考试安排
 * @param {*} classId 班级id
 */
const queryClassExamination = (classId) => {
  let sql = `SELECT a.*, b.className, c.name AS testName, c.fullMarks, d.name AS courseName FROM examination AS a 
  LEFT JOIN classes AS b ON a.classId=b.id
  LEFT JOIN testPaper AS c ON a.testPaper=c.id
  LEFT JOIN curriculum AS d ON a.curriculumId=d.id WHERE a.classId=${classId} and a.isEnd=0 ORDER BY a.startTime`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 查询教师不同班级所教的课程
 * @param {*} classId 班级ID
 */
const queryClassCourse = (classId) => {
  let teacherId = global.userInfo.id
  let sql = `SELECT b.id, b.name FROM TCCrelation AS a LEFT JOIN curriculum AS b ON a.curriculumId=b.id WHERE a.teacherId=${teacherId} AND a.classId=${classId}`
  return exec(sql).then(row => {
    return row || []
  })
}


module.exports = {
  queryMainClassPage,
  queryClassExamination,
  queryClassCourse
}