const { exec } = require('../../db/mysql')

/**
 * 查询全部考试记录
 * @param {*} name 考试名称
 * @param {*} courseId 课程id
 * @param {*} classId 班级id
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryExamintionPage = (name, courseId, classId, testPaperId, pageSize, current, isEnd) => {
  let sql = `SELECT a.*, b.className, c.name AS testName, c.fullMarks, d.name AS courseName FROM examination AS a 
  LEFT JOIN classes AS b ON a.classId=b.id
    LEFT JOIN testPaper AS c ON a.testPaper=c.id
    LEFT JOIN curriculum AS d ON a.curriculumId=d.id where 1=1 `
  let countSql = `SELECT COUNT(*) as count FROM examination`
  if (name) {
    sql += `and a.name like '%${name}%' `
  }
  if (courseId) {
    sql += `and a.curriculumId = ${courseId} `
  }
  if (classId) {
    sql += `and a.classId = ${classId} `
  }
  if (testPaperId) {
    sql += `and a.testPaper = ${testPaperId} `
  }
  if (isEnd > -1) {
    sql += `and a.isEnd = ${isEnd} `
  }
  sql += `order by a.isEnd, a.startTime`
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0].count
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

const queryAllTestPaper = () => {
  let sql = `SELECT * FROM testPaper `
  return exec(sql).then(row => {
    return row || []
  })
}

module.exports = {
  queryExamintionPage,
  queryAllTestPaper
}