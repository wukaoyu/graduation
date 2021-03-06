var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryMainClassPage,
  queryClassExamination,
  queryClassCourse
} = require("../../controller/teacher/classes")

router.post('/queryMainClassPage', (req, res) => {
  const { className, pageSize, current } = req.body
  const result = queryMainClassPage(className, pageSize, current)
  const resultData = result.then(data => {
    if (data) {
      let pageCount = data.count / pageSize
      let hasmore = true
      if (current >= pageCount || !current) {
        hasmore = false
      }
      let pageData = {
        ...data,
        hasmore
      }
      return new SuccessModel(pageData)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/queryClassExamination', (req, res) => {
  const { classId } = req.body
  const result = queryClassExamination(classId)
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

router.post('/queryClassCourse', (req, res) => {
  const { classId } = req.body
  const result = queryClassCourse(classId)
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