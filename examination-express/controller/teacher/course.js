const { exec } = require('../../db/mysql')

/**
 * 查询教师安排到的课程
 * @param {*} courseName 课程名称
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryCoursePage = (courseName, pageSize, current) => {
  let teacherId = global.userInfo.id
  let sql = `SELECT curTab.*, countTab.questionCount FROM
  (SELECT curriculumId FROM TCCrelation WHERE teacherId=${teacherId} GROUP BY curriculumId ) TCCTab LEFT JOIN
  (SELECT * FROM curriculum) curTab ON TCCTab.curriculumId=curTab.id LEFT JOIN
  (SELECT b.curriculumId, count(b.curriculumId) AS questionCount FROM curriculum AS a LEFT JOIN question AS b ON a.id=b.curriculumId  
  GROUP BY b.curriculumId) countTab on TCCTab.curriculumId=countTab.curriculumId where 1=1 
  `
  let countSql = `select count(teacherId) from TCCrelation where teacherId=${teacherId} GROUP BY teacherId`
  if (courseName) {
    sql += `and curTab.name like '%${courseName}%' `
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0]['count(teacherId)']
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
 * 查询题目分页信息
 * @param {*} curriculumId 课程名
 * @param {*} type 题目类型
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页 
 */
const queryQuestionPage = (curriculumId, questionTitle, type, pageSize, current) => {
  let sql = `SELECT a.*, b.username as createName FROM question  as a LEFT JOIN teacher AS b on a.createBy=b.id WHERE a.curriculumId=${curriculumId} order by a.id desc`
  let countSql = `select count(*) from question where curriculumId=${curriculumId} `
  let count = 0
  if (type) {
    sql += `and a.curriculumId like '%${type}%' `
  }
  if (questionTitle) {
    sql += `and a.questionTitle like '%${questionTitle}%' `
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  exec(countSql).then(num => {
    count = num[0]['count(*)']
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
  queryCoursePage,
  queryQuestionPage
}