var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const {
  queryClassesPage,
  insertClasses,
  queryClassId,
  upDataClasses,
  deleteClasses,
  queryStudentPage,
  upDataStudent,
  deleteStudent,
  insertStudent,
  queryStudentId
} = require("../../controller/admin/classes");
const XLSX= require('xlsx');

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

router.post('/upDataClasses', (req, res, next) => {
  const { id, className, startTime, graduationTime, mainTeacher } = req.body
  const result = upDataClasses(id, className, startTime, graduationTime, mainTeacher)
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

router.post('/deleteClasses', (req, res, next) => {
  const { id } = req.body
  const result = deleteClasses(id)
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

router.post('/queryClassId', (req, res, next) => {
  const { id } = req.body
  const result = queryClassId(id)
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

router.post('/queryStudentPage', (req, res, next) => {
  const { account, classId, username, sex, pageSize, current } = req.body
  const result = queryStudentPage(account, classId, username, sex, pageSize, current)
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

router.post('/upDataStudent', (req, res, next) => {
  const { id, classId, sex, username, account } = req.body
  const result = upDataStudent(classId, sex, username, account, id)
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

router.post('/deleteStudent', (req, res, next) => {
  const { id } = req.body
  const result = deleteStudent(id)
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

router.post('/insertStudent', (req, res, next) => {
  const { account, password, createBy, classId, username, sex, createIdentity } = req.body
  const createTime = nowDate()
  const result = insertStudent(account, password, createBy, createTime, classId, username, sex, 3, createIdentity)
  const resultData = result.then(data => {
    if (data === '该账号已存在') {
      return new ErrorModel('该账号已存在')
    }else if (data) {
      return new SuccessModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

router.post('/queryStudentId', (req, res, next) => {
  const { id } = req.body
  const result = queryStudentId(id)
  const resultData = result.then(data => {
    if (data) {
      return new SuccesssModel(data)
    }
    return new ErrorModel('异常错误')
  })
  resultData.then(data => {
    res.json(data)
  })
})

/**
 * 解析上传的excel 批量导入学生账号
 */
router.post('/fileStudentAccount', function (req, res, next) {
  let excelFile = req.files.file.data;
  let excelData = [];
  let nowSex = []
  const workbook = XLSX.read(excelFile);
  const sheetNames = workbook.SheetNames[0]; 
  const {createBy, createIdentity, classId} = req.body
  // console.log(workbook.Sheets[sheetNames])
  if (workbook.Sheets.hasOwnProperty(sheetNames)) {
      fromTo = workbook.Sheets[sheetNames]['!ref'];
      //解析excel文件得到数据
      excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames]));
  }
  if (excelData[0]['账号'] !== undefined && excelData[0]['密码'] !== undefined && excelData[0]['姓名'] !== undefined && excelData[0]['性别'] !== undefined){
      const createTime = nowDate()
      let result, isInsert = true
      for (let i = 0; i < excelData.length; i++) {
          if (excelData[i]['性别'] === '男') {
              nowSex[i] = 1
          }else if (excelData[i]['性别'] === '女') {
              nowSex[i] = 0
          }else {
              result = new ErrorModel(`性别只可以填‘男’或者‘女’，错误发生在第${i + 1}行，请修正后重新提交`)
              isInsert = false
              res.json(result)
          }
      }
      if (isInsert) {
          let havaAccountArray = []
          for (let i = 0; i < excelData.length; i++) {
            insertStudent(excelData[i]['账号'], excelData[i]['密码'],createBy , createTime, classId, excelData[i]['姓名'], nowSex[i], 3, createIdentity).then(data => {
              if (data) {
                  if (data === '该账号已存在') {
                      havaAccountArray.push(i + 2)
                  }
                  if (i === excelData.length - 1) {
                      let returnString = `成功添加${i + 1 - havaAccountArray.length}条数据`
                      // console.log(i, havaAccountArray)
                      if (havaAccountArray.length > 0) {
                          returnString += `，Excel表中的第${havaAccountArray.join('，')}行数据的账号已存在，已为您自动过滤`
                      }
                      result = new SuccessModel(returnString)
                      res.json(result)
                  }
              }else {
                  result = new ErrorModel('异常错误')
                  res.json(result)
              }
          })  
          }
      }
  }else {
      const errorData =  new ErrorModel('Excel内容有误')
      res.json(errorData)
  }
})

module.exports = router