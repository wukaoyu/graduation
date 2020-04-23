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
    return newData || {}
  })
}

/**
 * 查询不同课程对应的考试计划
 * @param {*} courseId 课程id
 */
const quertCourseExam = (courseId) => {
  let studentId = global.userInfo.id
  let sql = `SELECT a.*, c.name AS testPaperName, d.className, e.name AS courseName FROM examination AS a 
  LEFT JOIN student AS b on a.classId=b.classId 
  LEFT JOIN testPaper AS c on a.testPaper=c.id
  LEFT JOIN classes AS d ON a.classId=d.id
  LEFT JOIN curriculum AS e ON a.curriculumId=e.id
  WHERE b.id=${studentId} AND a.curriculumId = ${courseId} order by a.isEnd, a.startTime`
  return exec(sql).then(row => {
    return row || []
  })
}

module.exports = {
  queryStudentCourse,
  queryPracticeQuestion,
  quertCourseExam
}