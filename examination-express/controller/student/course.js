const { exec } = require('../../db/mysql')

/**
 * 查询学生上的课程
 */
const queryStudentCourse = () => {
  let studentId = global.userInfo.id
  let sql = `SELECT b.* FROM TCCrelation AS a LEFT JOIN curriculum AS b on a.curriculumId=b.id LEFT JOIN student AS c ON c.classId = a.classId WHERE c.id = ${studentId} `
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 查询所有题目
 * @param {*} courseId 
 */
const queryPracticeQuestion = (courseId) => {
  let sql = `SELECT * FROM question WHERE curriculumId = ${courseId}  and isTest !=1 and type=1 or type=2`
  let courseSql = `SELECT * FROM curriculum WHERE id = ${courseId}`
  let courseName 
  exec(courseSql).then(row => {
    courseName = row[0].name
  })
  return exec(sql).then(row => {
    let newData = {
      row,
      courseName
    }
    console.log(newData)
    return newData || {}
  })
}

module.exports = {
  queryStudentCourse,
  queryPracticeQuestion
}