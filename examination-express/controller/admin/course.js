const { exec } = require('../../db/mysql')

/**
 * 增加课程
 * @param {*} name 课程名称
 * @param {*} introduce 课程介绍
 * @param {*} createBy 创建人id
 * @param {*} createTime 创建时间
 * @param {*} coverImage 课程图片url
 */
const insertCoures = (name, introduce, createBy, createTime, coverImage) => {
  let sql = `INSERT INTO curriculum (name ${introduce ? ', introduce' : '' }, createBy, createTime ${coverImage ? ',coverImage' : '' }) 
            VALUES ('${name}' ${introduce ? `, ' ${introduce}'` : '' }, ${createBy}, '${createTime}' ${coverImage ? `, '${coverImage}'` : '' })`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除课程
 * @param {*} id 
 */
const deleteCourse = (id) => {
  let sql = `DELETE FROM curriculum WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 修改课程信息
 * @param {*} name 课程名称
 * @param {*} introduce 课程介绍
 * @param {*} coverImage 课程收图
 * @param {*} id 课程id
 */
const updataCouerse = (name, introduce, coverImage, id) => {
  let sql = `UPDATE curriculum SET `
  if (name) {
    sql += `name='${name}', `
  }
  if (introduce) {
    sql += `introduce='${introduce}',`
  }
  if (coverImage) {
    sql += `coverImage='${coverImage}',`
  }
  sql = sql.substring(0, sql.length - 1)
  sql += `WHERE id=${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 查询全部课程
 */
const queryAllCourse = () => {
  let sql = `SELECT informTab.*, countTab.questionCount FROM 
  (SELECT a.*, b.username as createName FROM curriculum AS a LEFT JOIN users AS b ON a.createBy=b.id) informTab LEFT JOIN
  (SELECT b.curriculumId, count(b.curriculumId) AS questionCount FROM curriculum AS a LEFT JOIN question AS b ON a.id=b.curriculumId  GROUP BY b.curriculumId) countTab 
  on informTab.id = countTab.curriculumId`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 查询课程分页信息
 * @param {*} name 课程名
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryCoursePage = (name, pageSize, current) => {
  let sql = `SELECT curTab.*, countTab.questionCount, paper.testPaperCount FROM
  (SELECT * FROM curriculum) curTab  LEFT JOIN
  (SELECT curriculumId FROM TCCrelation  GROUP BY curriculumId ) TCCTab ON TCCTab.curriculumId=curTab.id LEFT JOIN
  (SELECT b.curriculumId, count(b.curriculumId) AS questionCount FROM curriculum AS a LEFT JOIN question AS b ON a.id=b.curriculumId  
  GROUP BY b.curriculumId) countTab on TCCTab.curriculumId=countTab.curriculumId LEFT JOIN
	(SELECT curriculumId, count(*) AS testPaperCount FROM testPaper GROUP BY curriculumId) paper ON TCCTab.curriculumId=paper.curriculumId`
  let countSql = `select count (*) from curriculum`
  if (name) {
    sql += `and name like '%${name}%' `
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0]['count (*)']
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
  insertCoures,
  deleteCourse,
  updataCouerse,
  queryAllCourse,
  queryCoursePage
}