import { request } from '../../util/apiHelps'

/**
 * 查询教师安排到的课程
 * @param {*} data 
 */
export async function queryCoursePage(data = {}) {
  return request({
    url:'/teacher/course/queryCoursePage',
    method:'POST',
    data: data
  })
}

/**
 * 查询题目
 * @param {*} data 
 */
export async function queryQuestionPage(data = {}) {
  return request({
    url:'/teacher/course/queryQuestionPage',
    method:'POST',
    data: data
  })
}

/**
 * 增加题目
 * @param {*} data 
 */
export async function insertQuestion(data = {}) {
  return request({
    url:'/teacher/course/insertQuestion',
    method:'POST',
    data: data
  })
}

/**
 * 删除题目
 * @param {*} data 
 */
export async function deleteQuestion(data = {}) {
  return request({
    url:'/teacher/course/deleteQuestion',
    method:'POST',
    data: data
  })
}

/**
 * 修改题目
 * @param {*} data 
 */
export async function updataQuestion(data = {}) {
  return request({
    url:'/teacher/course/updataQuestion',
    method:'POST',
    data: data
  })
}

/**
 * 查询试卷分页信息
 * @param {*} data 
 */
export async function queryTestPage(data = {}) {
  return request({
    url:'/teacher/course/queryTestPage',
    method:'POST',
    data: data
  })
}

/**
 * 增加试卷
 * @param {*} data 
 */
export async function insertTestPaper(data = {}) {
  return request({
    url:'/teacher/course/insertTestPaper',
    method:'POST',
    data: data
  })
}

/**
 * 增加试卷
 * @param {*} data 
 */
export async function upDataTestPaper(data = {}) {
  return request({
    url:'/teacher/course/upDataTestPaper',
    method:'POST',
    data: data
  })
}

/**
 * 增加试卷
 * @param {*} data 
 */
export async function deleteTestPaper(data = {}) {
  return request({
    url:'/teacher/course/deleteTestPaper',
    method:'POST',
    data: data
  })
}

/**
 * 增加试卷
 * @param {*} data 
 */
export async function queryTestPaperId(data = {}) {
  return request({
    url:'/teacher/course/queryTestPaperId',
    method:'POST',
    data: data
  })
}


/**
 * 查询可以试卷可添加题目的分页信息
 * @param {*} data 
 */
export async function queryChooseQuestion(data = {}) {
  return request({
    url:'/teacher/course/queryChooseQuestion',
    method:'POST',
    data: data
  })
}


/**
 * 批量添加问题
 * @param {*} data 
 */
export async function fileInsertQuestion(data = {}) {
  return request({
    url:'/teacher/course/fileInsertQuestion',
    method:'POST',
    data: data
  })
}