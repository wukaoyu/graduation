import { request } from '../util/apiHelps'

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

/**
 * 添加教师账号
 * @param {*} data 
 */
export async function insertTeacherAccount(data = {}) {
    return request({
        url:'/admin/insertTeacherAccount',
        method:'POST',
        data: data
      })
}
/**
 * 修改教师账号
 * @param {*} data 
 */
export async function updataTeacherAccount(data = {}) {
    return request({
        url:'/admin/updataTeacherAccount',
        method:'POST',
        data: data
      })
}
/**
 * 删除教师账号
 * @param {*} data 
 */
export async function deleteTeacherAccount(data = {}) {
    return request({
        url:'/admin/deleteTeacherAccount',
        method:'POST',
        data: data
      })
}

/**
 * 上传excel表格
 * @param {*} data 
 */
export async function fileTeacherAccount(data = {}) {
  return request({
      url:'/admin/fileTeacherAccount',
      method:'POST',
      data: data
    })
}