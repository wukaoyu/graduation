var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryStudentCourse,
  queryPracticeQuestion,
  quertCourseExam
} = require("../../controller/student/course")
const { queryQuestionPage } = require("../../controller/teacher/course")
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
  const { courseId, singleNum, multipleNum } = req.body
  const result = queryPracticeQuestion(courseId)
  const resultData = result.then(data => {
    if (data) {
      let singArray = []
      let multipleArray = []
      data.row.forEach(item => {
        if (item.type === 1) {
          singArray.push(item)
        }else if (item.type === 2) {
          multipleArray.push(item)
        }
      })
      let singLength = singArray.length
      let multipleLength = multipleArray.length
      let newSingArray = myRandom(singLength < singleNum ? singLength : singleNum, 0, singLength)
      let newMultipleArray = myRandom(multipleLength < multipleNum ? multipleLength : multipleNum, 0, multipleLength)
      let newData = {
        row: [],
        courseName: data.courseName
      }
      newSingArray.forEach(item => {
        newData.row.push(singArray[item])
      })
      newMultipleArray.forEach(item => {
        newData.row.push(multipleArray[item])
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

router.post('/queryQuestionLength', (req, res) => {
  const { courseId } = req.body 
  const result = queryQuestionPage(courseId)
  let singLength = 0
  let multipleLength = 0
  const resultData = result.then(data => {
    if (data) {
      data.row.forEach(item => {
        if (item.type === 1) {
          singLength++
        }else if (item.type === 2) {
          multipleLength++
        }
      })
      return new SuccessModel({
        singLength,
        multipleLength
      })
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

module.exports = router