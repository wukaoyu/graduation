import request from '../util/apiHelps'

// 查询教师分页信息
export async function queryTeacherPage(data = {}) {
    return request({
      url:'/admin/queryTeacherPage',
      method:'POST',
      data: data
    })
}

/**
 * 查询所有管理员
 * @param {*} data 
 */
export async function queryAllAdmin(data = {}) {
    return request({
      url:'/admin/queryAllAdmin',
      method:'POST',
      data: data
    })
}