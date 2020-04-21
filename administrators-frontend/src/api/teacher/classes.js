import { request } from '../../util/apiHelps'

/**
 * 查询我管理的班级分页数据
 * @param {*} data 
 */
export async function queryMainClassPage(data = {}) {
  return request({
    url:'/teacher/classes/queryMainClassPage',
    method:'POST',
    data: data
  })
}

/**
 * 查询每个班级的所有考试安排
 * @param {*} data 
 */
export async function queryClassExamination(data = {}) {
  return request({
    url:'/teacher/classes/queryClassExamination',
    method:'POST',
    data: data
  })
}

/**
 * 查询教师不同班级所教的课程
 * @param {*} data 
 */
export async function queryClassCourse(data = {}) {
  return request({
    url:'/teacher/classes/queryClassCourse',
    method:'POST',
    data: data
  })
}