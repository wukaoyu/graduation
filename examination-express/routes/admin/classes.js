var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const { queryClassesPage, insertClasses } = require("../../controller/admin/classes");
const { nowDate } = require("../../public/utils/main")

router.post('/queryClassesPage', (req, res, next) => {
  const { className, pageSize, current } = req.body
  const result = queryClassesPage(className, pageSize, current)
  const resultData = result.then(data => {
    if (data) {
      let pageCount = data.count / pageSize
      let hasmore = true
      if (current >= pageCount) {
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

router.post('/insertClasses', (req, res, next) => {
  const { className, createBy, startTime, graduationTime, mainTeacher } = req.body
  const createTime = nowDate()
  const result = insertClasses(className, createTime, createBy, startTime, graduationTime, mainTeacher)
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