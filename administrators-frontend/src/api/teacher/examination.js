import { request } from '../../util/apiHelps'

/**
 * 查询教师管理的考试记录
 * @param {*} data 
 */
export async function queryPersonalExaminationPage(data = {}) {
  return request({
    url:'/teacher/examination/queryPersonalExaminationPage',
    method:'POST',
    data: data
  })
}

/**
 * 查询教师管理的全部班级
 * @param {*} data 
 */
export async function queryAllTeacherClass(data = {}) {
  return request({
    url:'/teacher/examination/queryAllTeacherClass',
    method:'POST',
    data: data
  })
}

/**
 * 查询教师可管理的全部试卷
 * @param {*} data 
 */
export async function queryAllTeacherTestPaper(data = {}) {
  return request({
    url:'/teacher/examination/queryAllTeacherTestPaper',
    method:'POST',
    data: data
  })
}

/**
 * 增加考试计划
 * @param {*} data 
 */
export async function insertExamination(data = {}) {
  return request({
    url:'/teacher/examination/insertExamination',
    method:'POST',
    data: data
  })
}

/**
 * 删除考试计划
 * @param {*} data 
 */
export async function deleteExamination(data = {}) {
  return request({
    url:'/teacher/examination/deleteExamination',
    method:'POST',
    data: data
  })
}

/**
 * 修改考试计划
 * @param {*} data 
 */
export async function updataExamination(data = {}) {
  return request({
    url:'/teacher/examination/updataExamination',
    method:'POST',
    data: data
  })
}

/**
 * 修改考试计划
 * @param {*} data 
 */
export async function queryStudentResult(data = {}) {
  return request({
    url:'/teacher/examination/queryStudentResult',
    method:'POST',
    data: data
  })
}

/**
 * 根据id查询答题信息
 * @param {*} data 
 */
export async function queryResultById(data = {}) {
  return request({
    url:'/teacher/examination/queryResultById',
    method:'POST',
    data: data
  })
}

// 修改考试结果
export async function updataResult(data = {}) {
  return request({
    url:'/student/examination/updataResult',
    method:'POST',
    data: data
  })
}
