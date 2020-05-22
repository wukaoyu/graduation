import { request } from '../util/apiHelps'

// 查询学生上的课程
export async function queryStudentCourse(data = {}) {
    return request({
      url:'/student/course/queryStudentCourse',
      method:'POST',
      data: data
    })
}
// 查询练习题
export async function queryPracticeQuestion(data = {}) {
  return request({
    url:'/student/course/queryPracticeQuestion',
    method:'POST',
    data: data
  })
}

// 查询不同课程的考试安排
export async function quertCourseExam(data = {}) {
  return request({
    url:'/student/course/quertCourseExam',
    method:'POST',
    data: data
  })
}

// 查询不同课程的考试安排
export async function queryQuestionLength(data = {}) {
  return request({
    url:'/student/course/queryQuestionLength',
    method:'POST',
    data: data
  })
}
