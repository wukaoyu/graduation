import { request } from '../util/apiHelps'

// 查询学生试卷
export async function queryStudentTestPaper(data = {}) {
  return request({
    url:'/student/examination/queryStudentTestPaper',
    method:'POST',
    data: data
  })
}

// 添加考试结果
export async function insertStudentResult(data = {}) {
  return request({
    url:'/student/examination/insertStudentResult',
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

// 主观题批改
export async function examCorrection(data = {}) {
  return request({
    url:'/student/examination/examCorrection',
    method:'POST',
    data: data
  })
}