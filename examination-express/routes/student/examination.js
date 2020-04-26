var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryStudentTestPaper,
  insertStudentResult,
  queryExaminationById,
  updataResult,
  queryMyResult
} = require("../../controller/student/examination")
const { nowDate } = require('../../public/utils/main');

router.post('/queryStudentTestPaper', (req, res) => {
  const { examinationId } = req.body
  const result = queryStudentTestPaper(examinationId)
  const resultData = result.then(data => {
    if (data.length) {
      let newQuestionJson = JSON.parse(data[0].questionJson)
      let newAnswerJson = JSON.parse(data[0].answerJson)
      let newResult = JSON.parse(data[0].result)
      newQuestionJson.forEach(item => {
        delete item.answerTrue
      })
      data[0].questionJson = newQuestionJson
      data[0].answerJson = newAnswerJson
      data[0].result = newResult
      return new SuccessModel(data[0])
    }else if (data.length === 0) {
      return new ErrorModel('暂无数据')
    }
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/insertStudentResult', (req, res) => {
  const { examinationId } = req.body
  const queryExamin = queryExaminationById(examinationId)
  const result = queryExamin.then(examinData => {
    console.log(nowDate(), examinData.startTime)
    if (nowDate() < examinData.startTime) {
      return '考试时间未到，请耐心等待！'
    }else if (nowDate > examinData.endTime) {
      return '考试时间已过'
    }else {
      return insertStudentResult(examinationId, examinData.rules)
    }
  })
  const resultData = result.then(data => {
    if (typeof data === 'string') {
      return new ErrorModel(data)
    }
    return new SuccessModel(data)
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/updataResult', (req, res) => {
  const { id, answerJson, result, isEnd, questionJson } = req.body
  const newResult = updataResult(id, answerJson, result, isEnd, questionJson)
  const resultData = newResult.then(data => {
    if (data) {
      return new SuccessModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})
// 批改选择题
router.post('/examCorrection', (req, res) => {
  const { examinationId } = req.body
  const result = queryStudentTestPaper(examinationId)
  const nowDate = nowDate()
  const resultData = result.then(data => {
    if (data.length) {
      let newQuestionJson = JSON.parse(data[0].questionJson)
      let newAnswerJson = JSON.parse(data[0].answerJson)
      let fullMarks = 0
      let nowResult = {
        subjective: 0,
        allResultArray: []
      }
      newQuestionJson.forEach((item, index) => {
        if (item.type === 1 || item.type === 2) {
          if (JSON.stringify(item.answerTrue) === JSON.stringify(newAnswerJson[index])) {
            fullMarks += parseInt(item.score)
            item.isTrue = true
            nowResult.allResultArray[index] = fullMarks
          }else {
            item.isTrue = false
            nowResult.allResultArray[index] = 0
          }
        }
        delete item.difficultyArray
      })
      nowResult.subjective = fullMarks
      updataResult(data[0].id, JSON.stringify(newAnswerJson), JSON.stringify(nowResult), 1, JSON.stringify(newQuestionJson), nowDate)
      return new SuccessModel({fullMarks})
    }else if (data.length === 0) {
      return new ErrorModel('暂无数据')
    }
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/queryMyResult', (req, res) => {
  const { examinationId } = req.body
  const result = queryMyResult(examinationId)
  const resultData = result.then(data => {
    if (data.id) {
      data.result = JSON.parse(data.result)
      data.questionJson = JSON.parse(data.questionJson)
      data.answerJson = JSON.parse(data.answerJson)
      return new SuccessModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

module.exports = router