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