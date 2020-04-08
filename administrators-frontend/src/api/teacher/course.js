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