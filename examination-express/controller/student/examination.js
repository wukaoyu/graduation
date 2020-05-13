const { exec } = require('../../db/mysql')
const { nowDate } = require("../../public/utils/main")

/**
 * 查询考试题目
 * @param {*} examinationId 考试计划id
 */
const queryStudentTestPaper = (examinationId) => {
  let studentId = global.userInfo.id
  let sql = `SELECT a.*, b.name AS examinationName,b.startTime AS examinationStart, b.testTime FROM studentResult AS a 
  LEFT JOIN examination AS b ON a.examinationId=b.id 
  WHERE a.studentId =${studentId} AND a.examinationId=${examinationId}`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 添加考试结果
 * @param {*} examinationId 考试计划id
 * @param {*} questionJson 问题json
 */
const insertStudentResult = (examinationId, questionJson) => {
  let studentId = global.userInfo.id
  const startTime = nowDate()
  let sql = `INSERT INTO studentResult (studentId, examinationId, startTime, isEnd, questionJson,answerJson) 
  VALUES (${studentId}, ${examinationId}, '${startTime}', 0, '${questionJson}','[]')`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 根据id查询考试计划
 * @param {*} examinationId 试卷id
 */
const queryExaminationById = (examinationId) => {
  let sql = `select a.*, b.rules from examination as a left join testPaper as b on a.testPaper=b.id where a.id = ${examinationId}`
  return exec(sql).then(row => {
    return row[0] || {}
  })
}

/**
 * 修改考试结果
 * @param {*} id 记录id
 * @param {*} answerJson 答题结果
 * @param {*} result 批改结果
 * @param {*} isEnd 是否结束
 * @param {*} questionJson 问题数据
 * @param {*} endTime 提交时间
 */
const updataResult = (id, answerJson, result, isEnd, questionJson, endTime) => {
  let sql = `UPDATE studentResult SET `
  if (answerJson) {
    sql += `answerJson='${answerJson}',`
  }
  if (result) {
    sql += `result='${result}',`
  }
  if (isEnd) {
    sql += `isEnd=${isEnd},`
  }
  if (questionJson) {
    sql += `questionJson='${questionJson}',`
  }
  if (endTime) {
    sql += `endTime='${endTime}',`
  }
  sql = sql.substring(0, sql.length - 1)
  sql += ` WHERE id=${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 根据考试id查询学生成绩
 * @param {*} examinationId 考试id
 */
const queryMyResult = (examinationId) => {
  let studentId = global.userInfo.id
  let sql = `SELECT a.*, b.name, b.isEnd AS examIsEnd FROM studentResult as a left join examination as b on a.examinationId=b.id WHERE a.studentId = ${studentId} AND a.examinationId = ${examinationId}`
  return exec(sql).then(row => {
    return row[0] || {}
  })
}

module.exports = {
  queryStudentTestPaper,
  insertStudentResult,
  queryExaminationById,
  updataResult,
  queryMyResult
}