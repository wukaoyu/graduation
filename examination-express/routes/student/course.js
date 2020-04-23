var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryStudentCourse,
  queryPracticeQuestion,
  quertCourseExam
} = require("../../controller/student/course")
const { myRandom } = require('../../public/utils/main');

router.post('/queryStudentCourse', (req, res) => {
  const result = queryStudentCourse()
  const resultData = result.then(data => {
    if (data) {
      return new SuccessModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/queryPracticeQuestion', (req, res) => {
  const { courseId } = req.body
  const result = queryPracticeQuestion(courseId)
  const resultData = result.then(data => {
    if (data) {
      let length = data.row.length
      let newArray = myRandom(length < 20 ? length : 20, 0, length)
      let newData = {
        row: [],
        courseName: data.courseName
      }
      newArray.forEach(item => {
        newData.row.push(data.row[item])
      })
      return new SuccessModel(newData)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/quertCourseExam', (req, res) => {
  const { courseId } = req.body
  const result = quertCourseExam(courseId)
  const resultData = result.then(data => {
    if (data) {
      return new SuccessModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

module.exports = router