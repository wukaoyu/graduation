import { request } from '../../util/apiHelps'

/**
 * 查询课程分页信息
 * @param {*} data 
 */
export async function queryCoursePage(data = {}) {
  return request({
    url:'/admin/course/queryCoursePage',
    method:'POST',
    data: data
  })
}

/**
 * 添加课程
 * @param {*} data 
 */
export async function insertCoures(data = {}) {
  return request({
    url:'/admin/course/insertCoures',
    method:'POST',
    data: data
  })
}

/**
 * 查询所有管理员
 * @param {*} 删除课程 
 */
export async function deleteCourse(data = {}) {
  return request({
    url:'/admin/course/deleteCourse',
    method:'POST',
    data: data
  })
}

/**
 * 修改课程信息
 * @param {*} data 
 */
export async function updataCouerse(data = {}) {
  return request({
    url:'/admin/course/updataCouerse',
    method:'POST',
    data: data
  })
}

/**
 * 查询所有课程
 * @param {*} data 
 */
export async function queryAllCourse(data = {}) {
  return request({
    url:'/admin/course/queryAllCourse',
    method:'POST',
    data: data
  })
}