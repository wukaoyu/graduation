var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { queryTeacherAccount, queryAllAdmin, insertTeacherAccount, updataTeacherAccount, deleteTeacherAccount } = require("../controller/admin");
const { getPage, nowDate } = require("../public/utils/main")

/**
 * 查询教师账号分页信息
 */
router.post('/queryTeacherPage', function(req, res, next) {
    const {username, createBy, sex, account, startTime, endTime, pageSize, current} = req.body
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
router.post('/queryAllAdmin', function(req, res, next) {
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
router.post('/insertTeacherAccount', function(req, res, next){
    const {username, password, sex, account, createBy} = req.body
    const createTime = nowDate()
    const result = insertTeacherAccount(username, password,createBy,createTime, 2, account, sex)
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
router.post('/updataTeacherAccount', function(req, res, next){
    const {username, password, sex, account, id} = req.body
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
router.post('/deleteTeacherAccount', function(req, res, next){
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
module.exports = router;
