const { exec } = require('../../db/mysql')

/**
 * 查询教师安排到的课程
 * @param {*} courseName 课程名称
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页
 */
const queryCoursePage = (courseName, pageSize, current) => {
  let teacherId = global.userInfo.id
  let sql = `SELECT curTab.*, countTab.questionCount, paper.testPaperCount FROM
  (SELECT curriculumId FROM TCCrelation WHERE teacherId=${teacherId} GROUP BY curriculumId ) TCCTab LEFT JOIN
  (SELECT * FROM curriculum) curTab ON TCCTab.curriculumId=curTab.id LEFT JOIN
  (SELECT b.curriculumId, count(b.curriculumId) AS questionCount FROM curriculum AS a LEFT JOIN question AS b ON a.id=b.curriculumId  
  GROUP BY b.curriculumId) countTab on TCCTab.curriculumId=countTab.curriculumId LEFT JOIN
	(SELECT curriculumId, count(*) AS testPaperCount FROM testPaper GROUP BY curriculumId) paper ON TCCTab.curriculumId=paper.curriculumId
  `
  let countSql = `select count(curriculumId) from TCCrelation where teacherId=${teacherId} GROUP BY curriculumId`
  if (courseName) {
    sql += `and curTab.name like '%${courseName}%' `
  }
  if (pageSize && current) {
    sql += ` limit ${(current - 1) * pageSize},${pageSize} `
  }
  let count = 0
  exec(countSql).then(num => {
    count = num.length
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
const queryQuestionPage = (curriculumId, questionTitle, difficulty, type, pageSize, current) => {
  let sql = `SELECT a.*, b.username as createName FROM question  as a LEFT JOIN teacher AS b on a.createBy=b.id WHERE a.curriculumId=${curriculumId} `
  let countSql = `select count(*) from question where curriculumId=${curriculumId} `
  let count = 0
  if (type) {
    sql += `and a.type = ${type} `
    countSql += `and type = ${type} `
  }
  if (difficulty > -1) {
    sql += `and a.difficulty = ${difficulty} `
    countSql += `and difficulty = ${difficulty} `
  }
  if (questionTitle) {
    sql += `and a.questionTitle like '%${questionTitle}%' `
    countSql += `and questionTitle like '%${questionTitle}%' `
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
  // console.log(sql)
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
 * @param {*} questionJson 问题json
 * @param {*} isTest 是否为测试题
 * @param {*} questionTitle 题目主要内容
 */
const updataQuestion = (id, answerTrue, difficulty = -1, imgUrl, answerJson, questionJson, isTest = -1, questionTitle) => {
  let sql = `UPDATE question SET `
  if (answerTrue) {
    sql += `answerTrue='${answerTrue}',`
  }
  if (difficulty > -1) {
    sql += `difficulty=${difficulty},`
  }
  if (imgUrl === null) {
    sql += `imgUrl=${null},`
  }else if (imgUrl) {
    sql += `imgUrl='${imgUrl}',`
  }
  if (answerJson) {
    sql += `answerJson='${answerJson}',`
  }
  if (questionJson) {
    sql += `questionJson='${questionJson}',`
  }
  if (isTest > -1) {
    sql += `isTest=${isTest},`
  }
  if (questionTitle) {
    sql += `questionTitle='${questionTitle}',`
  }
  sql = sql.substring(0, sql.length - 1)
  sql += ` WHERE id = ${id}`
  console.log(sql)
  return exec(sql).then(row => {
      return row || {}
  })
}

/**
 * 查询试卷分页信息
 * @param {*} name 试卷名称
 * @param {*} curriculumId 班级id
 * @param {*} pageSize 每页显示的条数
 * @param {*} current 当前第几页 
 */
const  queryTestPage = (name, curriculumId, pageSize, current) => {
  let sql = `SELECT a.*, b.username as createName FROM testPaper AS a LEFT JOIN teacher AS b ON a.createBy=b.id WHERE curriculumId=${curriculumId} `
  let countSql = `select count(*) from testPaper where curriculumId=${curriculumId} `
  if (name) {
    sql += `and name like '%${name}%' `
  }
  if (pageSize && current) {
    sql += `limit ${(current - 1) * pageSize},${pageSize} `
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
 * 增加试卷
 * @param {*} name 试卷名称
 * @param {*} createBy 创建者
 * @param {*} createTime 创建试卷
 * @param {*} fullMarks 满分
 * @param {*} rules 规则
 * @param {*} curriculumId 班级ID
 */
const insertTestPaper = (name, createBy, createTime, fullMarks, rules, curriculumId) => {
  let sql = `INSERT INTO testPaper (name, createBy, createTime, fullMarks, rules, curriculumId) 
  VALUES ('${name}', ${createBy}, '${createTime}', ${fullMarks}, '${rules}', '${curriculumId}')`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 修改试卷信息
 * @param {*} name 试卷名称
 * @param {*} fullMarks 满分
 * @param {*} rules 试卷规则
 * @param {*} id 试卷id
 */
const upDataTestPaper = (name, fullMarks, rules, id) => {
  let sql = `UPDATE testPaper SET `
  if (name) {
    sql += `name='${name}',`
  }
  if (fullMarks) {
    sql += `fullMarks=${fullMarks},`
  }
  if (rules) {
    sql += `rules='${rules}',`
  }
  sql = sql.substring(0, sql.length - 1)
  sql += ` WHERE id = ${id}`
  return exec(sql).then(row => {
    return row || {}
  })
}

/**
 * 删除试卷
 * @param {*} id 试卷id
 */
const deleteTestPaper = (id) => {
  let sql = `DELETE FROM testPaper WHERE id = ${id}`
  return exec(sql).then(row => {
      return row || {}
  })
}

/**
 * 根据id查询试卷
 * @param {*} id 试卷id
 * @param {*} curriculumId 班级id
 */
const queryTestPaperId = (id, curriculumId) => {
  let sql = `SELECT a.*, b.username as createName FROM testPaper AS a LEFT JOIN teacher AS b ON a.createBy=b.id WHERE a.id=${id} and a.curriculumId=${curriculumId}`
  return exec(sql).then(row => {
    return row[0] || {}
  })
}

/**
 * 添加试卷中的题目，需要排除试卷中已经存在的
 * @param {*} paperId 试卷id
 */
const queryChooseQuestion = (paperId, curriculumId, questionTitle, difficulty, type, pageSize, current) => {
  let paperSql = `select * from testPaper where id = ${paperId}`
  let curriculumSql = `SELECT a.*, b.username as createName FROM question  as a LEFT JOIN teacher AS b on a.createBy=b.id WHERE a.curriculumId=${curriculumId} and a.isTest not in (0)`
  let notIdArray = exec(paperSql).then(row => {
    let notIdArray = []
    let nowRules = JSON.parse(row[0].rules)
    nowRules.forEach(item => {
      notIdArray.push(item.id)
    })
    return notIdArray
  })
  return notIdArray.then(data => {
    let countSql = `select count(*) from question where curriculumId=${curriculumId} `
    let count = 0
    if (type) {
      curriculumSql += `and a.type = ${type} `
    }
    if (difficulty > -1) {
      curriculumSql += `and a.difficulty = ${difficulty} `
    }
    if (questionTitle) {
      curriculumSql += `and a.questionTitle like '%${questionTitle}%' `
    }
    if (data.length > 0) {
      countSql += `and id not in (${data.toString()}) `
      curriculumSql += `and a.id not in (${data.toString()}) `
    }
    curriculumSql += `order by a.id desc`
    if (pageSize && current) {
      curriculumSql += ` limit ${(current - 1) * pageSize},${pageSize} `
    }  
    exec(countSql).then(num => {
      count = num[0]['count(*)']
      return num
    })
    return exec(curriculumSql).then(row => {
      let rowData = row || []
      let resultData = {
        row: rowData,
        count: count
      }
      return resultData
    })
  })
}

/**
 * 删除某门课程的全部题目
 * @param {*} courseId 课程id
 */
const deleteAllCourseQuetion = (courseId) => {
  let sql = `DELETE FROM question WHERE curriculumId = ${courseId} and (type=1 or type=2) `
  return exec(sql).then(row => {
    return row || {}
  })
}

module.exports = {
  queryCoursePage,
  queryQuestionPage,
  insertQuestion,
  deleteQuestion,
  updataQuestion,
  queryTestPage,
  insertTestPaper,
  upDataTestPaper,
  deleteTestPaper,
  queryTestPaperId,
  queryChooseQuestion,
  deleteAllCourseQuetion
}