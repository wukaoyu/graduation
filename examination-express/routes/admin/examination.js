var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const { queryExamintionPage, queryAllTestPaper } = require("../../controller/admin/examination");

router.post('/queryExamintionPage', (req, res) => {
  const { name, courseId, classId, testPaperId, pageSize, current, isEnd } = req.body
  const result = queryExamintionPage(name, courseId, classId, testPaperId, pageSize, current, isEnd)
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

router.post('/queryAllTestPaper', (req, res, next) => {
  const result = queryAllTestPaper()
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