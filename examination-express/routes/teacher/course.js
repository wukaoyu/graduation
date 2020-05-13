var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryCoursePage,
  queryQuestionPage,
  updataQuestion,
  insertQuestion,
  deleteQuestion,
  queryTestPage,
  insertTestPaper,
  upDataTestPaper,
  deleteTestPaper,
  queryTestPaperId,
  queryChooseQuestion
} = require("../../controller/teacher/course")
const { nowDate } = require("../../public/utils/main")
const XLSX= require('xlsx');

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

router.post('/queryTestPage', (req, res) => {
  const { name, curriculumId, pageSize, current } = req.body
  const result = queryTestPage(name, curriculumId, pageSize, current)
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

router.post('/insertTestPaper', (req, res) => {
  const { name, fullMarks, rules, curriculumId }  = req.body
  const createBy = global.userInfo.id
  const createTime = nowDate()
  const result = insertTestPaper(name, createBy, createTime, fullMarks, rules, curriculumId)
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

router.post('/upDataTestPaper', (req, res) => {
  const { name, fullMarks, rules, id }  = req.body
  const result = upDataTestPaper(name, fullMarks, rules, id)
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

router.post('/deleteTestPaper', (req, res) => {
  const { id } = req.body
  const result = deleteTestPaper(id)
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


router.post('/queryTestPaperId', (req, res) => {
  const { id, curriculumId } = req.body
  const result = queryTestPaperId(id, curriculumId)
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

router.post('/queryChooseQuestion', (req, res) => {
  const { paperId, curriculumId, type, difficulty, pageSize, current, questionTitle } = req.body
  const result = queryChooseQuestion(paperId, curriculumId, questionTitle, difficulty, type, pageSize, current)
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

// 批量添加问题
router.post('/fileInsertQuestion', (req, res) => {
  let excelFile = req.files.file.data;
  let excelData = [];
  let nowSex = []
  const workbook = XLSX.read(excelFile);
  const sheetNames = workbook.SheetNames[0];
  const createBy = global.userInfo.id
  const curriculumId = req.body.curriculumId    
  const createTime = nowDate()
  // console.log(workbook.Sheets[sheetNames])
  if (workbook.Sheets.hasOwnProperty(sheetNames)) {
      fromTo = workbook.Sheets[sheetNames]['!ref'];
      //解析excel文件得到数据
      excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames]));
  }
  let difficultyArray = ['简单', '中等', '难', '非常困难']
  if (excelData[0]['答案'] !== undefined && excelData[0]['试题题干'] !== undefined && excelData[0]['难度等级'] !== undefined && excelData[0]['题型'] !== undefined){
    let addLength = 0
    excelData.forEach((item, index) => {
      let result
      let difficulty = difficultyArray.indexOf(item['难度等级'])
      let questionJson = {
        questionTitle: item['试题题干']
      }
      let questionTitle = item['试题题干']
      let answerTrue = []
      let answerJson = []
      switch (item['题型']) {
        case '判断题':
          if (item['答案'] === '正确') {
            answerTrue = [0]
          }else {
            answerTrue = [1]
          }
          answerJson = [
            {key: 0, answer: "正确"},
            {key: 0, answer: "错误"},
          ]
          answerTrue = JSON.stringify(answerTrue)
          answerJson = JSON.stringify(answerJson)
          questionJson = JSON.stringify(questionJson)
          result = insertQuestion(1, answerTrue, curriculumId, createBy, createTime, difficulty, '', answerJson, questionJson, 0, questionTitle)
          addLength++
          break;
        case '单选题':
          let answerJsonArray = item['试题选项'].split('##')
          for(let i = 0; i < answerJsonArray.length; i++) {
            answerJson[i] = {
              key: i,
              answer: answerJsonArray[i]
            }
          }
          answerTrue = [item['答案'].charCodeAt() - 65]
          answerTrue = JSON.stringify(answerTrue)
          answerJson = JSON.stringify(answerJson)
          questionJson = JSON.stringify(questionJson)
          result = insertQuestion(1, answerTrue, curriculumId, createBy, createTime, difficulty, '', answerJson, questionJson, 2, questionTitle)
          addLength++
          break;
        case '多选题':
          let mulAnswerJsonArray = item['试题选项'].split('##')
          let mulAnswerTrueArray = item['答案'].split('')
          for(let i = 0; i < mulAnswerJsonArray.length; i++) {
            answerJson[i] = {
              key: i,
              answer: mulAnswerJsonArray[i]
            }
          }
          for (let i = 0; i < mulAnswerTrueArray.length; i++) {
            answerTrue[i] = mulAnswerTrueArray[i].charCodeAt() - 65
          }
          answerTrue = JSON.stringify(answerTrue)
          answerJson = JSON.stringify(answerJson)
          questionJson = JSON.stringify(questionJson)
          result = insertQuestion(2, answerTrue, curriculumId, createBy, createTime, difficulty, '', answerJson, questionJson, 0, questionTitle)
          addLength++
          break;
        default:
          break;
      }
    })
    const successData = new SuccessModel(`成功添加${addLength}条数据`)
    res.json(successData)
    
  }else {
    const errorData =  new ErrorModel('Excel内容有误')
    res.json(errorData)
  }
})

module.exports = router