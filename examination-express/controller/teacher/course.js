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
  let sql = `SELECT a.*, b.username as createName FROM question  as a LEFT JOIN teacher AS b on a.createBy=b.id WHERE a.curriculumId=${curriculumId} `
  let countSql = `select count(*) from question where curriculumId=${curriculumId} `
  let count = 0
  if (type) {
    sql += `and a.type = ${type} `
  }
  if (questionTitle) {
    sql += `and a.questionTitle like '%${questionTitle}%' `
  }
  sql += `order by a.id desc`
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

/**
 * 添加题目
 * @param {*} type 题目类型
 * @param {*} answerTrue 正确答案
 * @param {*} curriculumId 课程id
 * @param {*} createBy 创建者
 * @param {*} createTime 创建时间
 * @param {*} difficulty 难度
 * @param {*} imgUrl 图片地址
 * @param {*} answerJson 选项数据
 * @param {*} questionJson 题目数据
 * @param {*} isTest 是否出现在测试题中
 * @param {*} questionTitle 题目主文本
 */
const insertQuestion = (type, answerTrue, curriculumId, createBy, createTime, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle) => {
  let sql = `INSERT INTO question (type, answerTrue, curriculumId, createBy, createTime, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle) 
      VALUES (${type}, '${answerTrue}', ${curriculumId}, ${createBy}, '${createTime}', ${difficulty}, '${imgUrl}', '${answerJson}', '${questionJson}', ${isTest}, '${questionTitle}')`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除题目
 * @param {*} id 题目id
 */
const deleteQuestion = (id) => {
  let sql = `DELETE FROM question WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}

/**
 * 修改题目
 * @param {*} id 题目id
 * @param {*} answerTrue 正确答案
 * @param {*} difficulty 难度
 * @param {*} imgUrl 图片url
 * @param {*} answerJson 选项json
 * @param {*} quetionJson 问题json
 * @param {*} isTest 是否为测试题
 * @param {*} questionTitle 题目主要内容
 */
const updataQuestion = (id, answerTrue, difficulty = -1, imgUrl, answerJson, quetionJson, isTest = -1, questionTitle) => {
  let sql = `UPDATE question SET `
  if (answerTrue) {
    sql += `answerTrue='${answerTrue}' `
  }
  if (difficulty > -1) {
    sql += `difficulty=${difficulty} `
  }
  if (imgUrl) {
    sql += `imgUrl='${imgUrl}' `
  }
  if (answerJson) {
    sql += `answerJson='${answerJson}' `
  }
  if (quetionJson) {
    sql += `quetionJson='${quetionJson}' `
  }
  if (isTest > -1) {
    sql += `isTest=${isTest} `
  }
  if (questionTitle) {
    sql += `questionTitle='${questionTitle}' `
  }
  sql += `WHERE id = ${id}`
  return exec(sql).then(row => {
      return row || {}
  })
}

module.exports = {
  queryCoursePage,
  queryQuestionPage,
  insertQuestion,
  deleteQuestion,
  updataQuestion
}