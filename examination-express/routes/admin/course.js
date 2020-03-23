var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  insertCoures,
  deleteCourse,
  updataCouerse,
  queryAllCourse,
  queryCoursePage
} = require("../../controller/admin/course");

const { nowDate } = require("../../public/utils/main")

router.post('/insertCoures', (req, res, next) => {
  const { name, introduce, createBy, coverImage} = req.body
  const createTime = nowDate()
  const result = insertCoures(name, introduce, createBy, createTime, coverImage)
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

router.post('/deleteCourse', (req, res, next) => {
  const { id } = req.body
  const result = deleteCourse(id)
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

router.post('/updataCouerse', (req, res, next) => {
  const { name, introduce, coverImage, id } = req.body
  const result = updataCouerse(name, introduce, coverImage, id)
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

router.post('/queryAllCourse', (req, res, next) => {
  const result = queryAllCourse()
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

router.post('/queryCoursePage', (req, res, next) => {
  const { name, pageSize, current } = req.body
  const result = queryCoursePage(name, pageSize, current)
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


module.exports = router