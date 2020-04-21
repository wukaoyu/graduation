import { request } from '../../util/apiHelps'
/**
 * 查询所有课程
 * @param {*} data 
 */
export async function queryExamintionPage(data = {}) {
  return request({
    url:'/admin/examination/queryExamintionPage',
    method:'POST',
    data: data
  })
}
/**
 * 查询所有课程
 * @param {*} data 
 */
export async function queryAllTestPaper(data = {}) {
  return request({
    url:'/admin/examination/queryAllTestPaper',
    method:'POST',
    data: data
  })
}
