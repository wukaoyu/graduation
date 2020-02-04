var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { queryTeacherAccount, queryAllAdmin } = require("../controller/admin");
const { getPage } = require("../public/utils/main")

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

module.exports = router;
