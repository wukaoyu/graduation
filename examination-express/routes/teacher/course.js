var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryCoursePage,
  queryQuestionPage,
  updataQuestion,
  insertQuestion,
  deleteQuestion
} = require("../../controller/teacher/course")
const { nowDate } = require("../../public/utils/main")

router.post('/queryCoursePage', (req, res) => {
  const { courseName, pageSize, current } = req.body
  const result = queryCoursePage( courseName, pageSize, current)
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

router.post('/queryQuestionPage', (req, res) => {
  const { curriculumId, type, difficulty, pageSize, current, questionTitle } = req.body
  const result = queryQuestionPage( curriculumId, questionTitle, difficulty, type, pageSize, current )
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

router.post('/insertQuestion', (req, res) => {
  const { type, answerTrue, curriculumId, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle } = req.body
  const createBy = global.userInfo.id
  const createTime = nowDate()
  const result = insertQuestion(type, answerTrue, curriculumId, createBy, createTime, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle)
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

router.post('/deleteQuestion', (req, res) => {
  const { id } = req.body
  const result = deleteQuestion(id)
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

router.post('/updataQuestion', (req, res) => {
  const { id, answerTrue, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle } = req.body
  const result = updataQuestion(id, answerTrue, difficulty, imgUrl, answerJson, questionJson, isTest, questionTitle)
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