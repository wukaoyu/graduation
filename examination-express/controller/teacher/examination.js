const { exec } = require('../../db/mysql')


/**
 * 查询教师的全部考试记录
 * @param {*} name 考试名称
 * @param {*} courseId 课程id
 * @param {*} classId 班级id
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryPersonalExaminationPage = (name, courseId, classId, testPaperId, pageSize, current) => {
  let teacherId = global.userInfo.id
  let sql = `SELECT a.*, b.className, c.name AS testName, c.fullMarks, d.name AS courseName FROM examination AS a 
  LEFT JOIN classes AS b ON a.classId=b.id
    LEFT JOIN testPaper AS c ON a.testPaper=c.id
    LEFT JOIN curriculum AS d ON a.curriculumId=d.id WHERE a.createBy=${teacherId} `
  let countSql = `SELECT COUNT(*) as count FROM examination WHERE createBy=${teacherId}`
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

/**
 * 查询教师管理的全部班级
 */
const queryAllTeacherClass = () => {
  let teacherId = global.userInfo.id
  let sql = `SELECT b.* FROM TCCrelation AS a LEFT JOIN classes AS b ON a.classId=b.id WHERE a.teacherId=${teacherId}  GROUP BY a.classId`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 查询教师可管理的全部试卷
 */
const queryAllTeacherTestPaper = () => {
  let teacherId = global.userInfo.id
  let sql = `SELECT testTab.id, testTab.name, testTab.curriculumId FROM testPaper AS testTab LEFT JOIN 
  (SELECT b.* FROM TCCrelation AS a LEFT JOIN  curriculum AS b ON a.curriculumId=b.id WHERE a.teacherId=${teacherId} GROUP BY a.curriculumId) AS classTab ON testTab.curriculumId=classTab.id`
  return exec(sql).then(row => {
    return row || []
  })
}

/**
 * 增加考试计划
 * @param {*} name 考试名
 * @param {*} createTime 创建试卷
 * @param {*} testPaper 试卷id
 * @param {*} startTime 可进入考试时间
 * @param {*} endTime 最晚进入考试时间
 * @param {*} classId 班级id
 * @param {*} curriculumId 课程id
 * @param {*} testTime 考试时长
 * @param {*} isEnd 考试是否结束
 */
const insertExamination = (name, createTime, testPaper, startTime, endTime, classId, curriculumId, testTime, isEnd) => {
  let teacherId = global.userInfo.id
  let sql = `INSERT INTO examination (name, createBy, createTime, testPaper, startTime, endTime, classId, curriculumId, testTime, isEnd) 
  VALUES ('${name}', ${teacherId}, '${createTime}', ${testPaper}, '${startTime}', '${endTime}', ${classId}, ${curriculumId}, '${testTime}', ${isEnd})`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除考试计划
 * @param {*} id 题目id
 */
const deleteExamination = (id) => {
  let sql = `DELETE FROM examination WHERE id = ${id}`
    return exec(sql).then(row => {
        return row || {}
    })
}

/**
 * 修改考试计划
 * @param {*} name 考试名
 * @param {*} testPaper 试卷id
 * @param {*} startTime 可进入考试时间
 * @param {*} endTime 最晚进入考试时间
 * @param {*} testTime 考试时长
 * @param {*} isEnd 是否考试结束
 * @param {*} id 考试计划id
 */
const updataExamination = (name, testPaper, startTime, endTime, testTime, isEnd, id)  => {
  let sql = `UPDATE examination SET `
  if (name) {
    sql += `name='${name}',`
  }
  if (testPaper) {
    sql += `testPaper=${testPaper},`
  }
  if (startTime) {
    sql += `startTime='${startTime}',`
  }
  if (endTime) {
    sql += `endTime='${endTime}',`
  }
  if (testTime) {
    sql += `testTime='${testTime}',`
  }
  if (isEnd > -1) {
    sql += `isEnd=${isEnd},`
  }
  sql = sql.substring(0, sql.length - 1)
  sql += ` WHERE id = ${id}`
  return exec(sql).then(row => {
      return row || {}
  })
}

/**
 * 查询参加考试的学生列表
 * @param {*} id 考试id
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryStudentResult = (id, pageSize, current) => {
  let sql = `SELECT a.*, b.username, b.headPortraitUrl, b.sex, c.className FROM studentResult as a 
  LEFT JOIN student AS b on a.studentId=b.id 
  LEFT JOIN classes AS c on b.classId=c.id
  WHERE a.examinationId = ${id}`
  let countSql = `SELECT count(*) as count FROM studentResult WHERE examinationId = ${id}`
  let examSql = `SELECT a.*, b.className FROM examination as a left join classes as b on a.classId=b.id WHERE a.id = ${id}`
  let examData = {}
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num[0].count
    return num
  })
  exec(examSql).then(row => {
    examData = row[0]
  })
  return exec(sql).then(row => {
    let rowData = row || []
    let resultData = {
      row: rowData,
      count: count,
      examData
    }
    return resultData
  })
}

/**
 *  根据id查询考试结果
 * @param {*} id 
 */
const queryResultById = (id) => {
  let sql = `SELECT a.*, b.name FROM studentResult as a left join examination as b on a.examinationId=b.id WHERE a.id = ${id}`
  return exec(sql).then(row => {
      return row[0] || {}
  })
}


module.exports = {
  queryPersonalExaminationPage,
  queryAllTeacherClass,
  queryAllTeacherTestPaper,
  insertExamination,
  deleteExamination,
  updataExamination,
  queryStudentResult,
  queryResultById
}