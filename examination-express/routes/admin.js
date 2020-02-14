var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { queryTeacherAccount, queryAllAdmin, insertTeacherAccount, updataTeacherAccount, deleteTeacherAccount } = require("../controller/admin");
const { getPage, nowDate } = require("../public/utils/main")
const multer  = require('multer');
const XLSX= require('xlsx');

/**
 * 查询教师账号分页信息
 */
router.post('/queryTeacherPage', function (req, res, next) {
    const { username, createBy, sex, account, startTime, endTime, pageSize, current } = req.body
    const result = queryTeacherAccount(username, createBy, sex, account, startTime, endTime);
    const resultData = result.then(data => {
        if (data) {
            const pageData = getPage(data, pageSize, current)
            return new SuccessModel(pageData)
        }
        return new ErrorModel('异常错误')
    })
    resultData.then(data => {
        res.json(data)
    })
});

/**
 * 查询所有管理员
 */
router.post('/queryAllAdmin', function (req, res, next) {
    const result = queryAllAdmin()
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

/**
 * 新增教师账号
 */
router.post('/insertTeacherAccount', function (req, res, next) {
    const { username, password, sex, account, createBy } = req.body
    const createTime = nowDate()
    const result = insertTeacherAccount(username, password, createBy, createTime, 2, account, sex)
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

/**
 * 修改教师账号
 */
router.post('/updataTeacherAccount', function (req, res, next) {
    const { username, password, sex, account, id } = req.body
    const result = updataTeacherAccount(username, password, account, sex, id)
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

/**
 * 删除教师账号
 */
router.post('/deleteTeacherAccount', function (req, res, next) {
    const { id } = req.body
    const result = deleteTeacherAccount(id)
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
/**
 * 解析上传的excel
 */
var upload = multer({ dest: 'uploads/'}) // 文件储存路径
router.post('/fileTeacherAccount',upload.single('avatar'), function (req, res, next) {
    let excelFile = req.files.file.data;
    let excelData = [];
    const workbook = XLSX.read(excelFile);
    const sheetNames = workbook.SheetNames[0]; 
    // console.log(workbook.Sheets[sheetNames])
    if (workbook.Sheets.hasOwnProperty(sheetNames)) {
        fromTo = workbook.Sheets[sheetNames]['!ref'];
        //解析excel文件得到数据
        excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames]));
    }
    res.json(excelData)
})
module.exports = router;
