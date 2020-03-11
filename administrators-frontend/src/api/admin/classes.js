import { request } from '../../util/apiHelps'

/**
 * 查询所有管理员
 * @param {*} data 
 */
export async function queryClassesPage(data = {}) {
  return request({
    url:'/admin/classes/queryClassesPage',
    method:'POST',
    data: data
  })
}

/**
 * 添加班级
 * @param {*} data 
 */
export async function insertClasses(data = {}) {
  return request({
    url:'/admin/classes/insertClasses',
    method:'POST',
    data: data
  })
}