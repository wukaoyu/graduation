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
 * 根据班级id查询班级信息
 * @param {*} data 
 */
export async function queryClassId(data = {}) {
  return request({
    url:'/admin/classes/queryClassId',
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

/**
 * 修改班级信息
 * @param {*} data 
 */
export async function upDataClasses(data = {}) {
  return request({
    url:'/admin/classes/upDataClasses',
    method:'POST',
    data: data
  })
}

/**
 * 删除班级
 * @param {*} data 
 */
export async function deleteClasses(data = {}) {
  return request({
    url:'/admin/classes/deleteClasses',
    method:'POST',
    data: data
  })
}

/**
 * 查询全部班级
 * @param {*} data 
 */
export async function queryAllClass(data = {}) {
  return request({
    url:'/admin/classes/queryAllClass',
    method:'POST',
    data: data
  })
}

/**
 * 查询学生分页信息
 * @param {*} data 
 */
export async function queryStudentPage(data = {}) {
  return request({
    url:'/admin/classes/queryStudentPage',
    method:'POST',
    data: data
  })
}

/**
 * 修改学生信息
 * @param {*} data 
 */
export async function upDataStudent(data = {}) {
  return request({
    url:'/admin/classes/upDataStudent',
    method:'POST',
    data: data
  })
}

/**
 * 删除学生账号
 * @param {*} data 
 */
export async function deleteStudent(data = {}) {
  return request({
    url:'/admin/classes/deleteStudent',
    method:'POST',
    data: data
  })
}

/**
 * 添加学生
 * @param {*} data 
 */
export async function insertStudent(data = {}) {
  return request({
    url:'/admin/classes/insertStudent',
    method:'POST',
    data: data
  })
}

/**
 * 根据学生id查询学生信息
 * @param {*} data 
 */
export async function queryStudentId(data = {}) {
  return request({
    url:'/admin/classes/queryStudentId',
    method:'POST',
    data: data
  })
}


/**
 * 批量导入学生账号
 * @param {*} data 
 */
export async function fileStudentAccount(data = {}) {
  return request({
    url:'/admin/classes/fileStudentAccount',
    method:'POST',
    data: data
  })
}