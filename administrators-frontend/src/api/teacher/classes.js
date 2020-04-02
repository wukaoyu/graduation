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