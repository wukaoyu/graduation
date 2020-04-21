var express = require('express');
var router = express.Router();
const { nowDate } = require("../../public/utils/main")
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryPersonalExaminationPage,
  queryAllTeacherClass,
  queryAllTeacherTestPaper,
  insertExamination,
  deleteExamination,
  updataExamination
} = require("../../controller/teacher/examination")

router.post('/queryPersonalExaminationPage', (req, res) => {
  const { name, courseId, classId, testPaperId, pageSize, current } = req.body
  const result = queryPersonalExaminationPage(name, courseId, classId, testPaperId, pageSize, current)
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

router.post('/queryAllTeacherClass', (req, res) => {
  const result = queryAllTeacherClass()
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

router.post('/queryAllTeacherTestPaper', (req, res) => {
  const result = queryAllTeacherTestPaper()
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

router.post('/insertExamination', (req, res) => {
  const { name, testPaper, startTime, endTime, classId, courseId, testTime } = req.body
  const createTime = nowDate()
  const result = insertExamination(name, createTime, testPaper, startTime, endTime, classId, courseId, testTime, 0)
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

router.post('/deleteExamination', (req, res) => {
  const { id } = req.body
  const result = deleteExamination(id)
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

router.post('/updataExamination', (req, res) => {
  const { name, testPaper, startTime, endTime, testTime, isEnd, id} = req.body
  const result = updataExamination(name, testPaper, startTime, endTime, testTime, isEnd, id)
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