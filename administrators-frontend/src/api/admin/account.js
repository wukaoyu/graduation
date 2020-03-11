import { request } from '../../util/apiHelps'

// 查询教师分页信息
export async function queryTeacherPage(data = {}) {
    return request({
      url:'/admin/account/queryTeacherPage',
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
      url:'/admin/account/queryAllAdmin',
      method:'POST',
      data: data
    })
}

/**
 * 查询所有管理员
 * @param {*} data 
 */
export async function queryAllTeacher(data = {}) {
  return request({
    url:'/admin/account/queryAllTeacher',
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
        url:'/admin/account/insertTeacherAccount',
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
        url:'/admin/account/updataTeacherAccount',
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
        url:'/admin/account/deleteTeacherAccount',
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
      url:'/admin/account/fileTeacherAccount',
      method:'POST',
      data: data
    })
}

 // 查询教师分页信息
 export async function queryAdminPage(data = {}) {
  return request({
    url:'/admin/account/queryAdminPage',
    method:'POST',
    data: data
  })
}

/**
* 添加教师账号
* @param {*} data 
*/
export async function insertAdminAccount(data = {}) {
  return request({
      url:'/admin/account/insertAdminAccount',
      method:'POST',
      data: data
    })
}
/**
* 修改教师账号
* @param {*} data 
*/
export async function updataAdminAccount(data = {}) {
  return request({
      url:'/admin/account/updataAdminAccount',
      method:'POST',
      data: data
    })
}
/**
* 删除教师账号
* @param {*} data 
*/
export async function deleteAdminAccount(data = {}) {
  return request({
      url:'/admin/account/deleteAdminAccount',
      method:'POST',
      data: data
    })
}

/**
* 上传excel表格
* @param {*} data 
*/
export async function fileAdminAccount(data = {}) {
return request({
    url:'/admin/account/fileAdminAccount',
    method:'POST',
    data: data
  })
}