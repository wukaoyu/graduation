var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../../model/resModel");
const { 
    queryTeacherAccount, 
    queryAllAdmin, 
    insertTeacherAccount, 
    updataTeacherAccount, 
    deleteTeacherAccount, 
    queryAdminAccount, 
    insertAdminAccount, 
    updataAdminAccount, 
    deleteAdminAccount,
    queryAllTeacher } = require("../../controller/admin/account");
const { getPage, nowDate } = require("../../public/utils/main")
const XLSX= require('xlsx');

// var upload = multer({ dest: 'uploads/' })

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
 * 查询所有管理员
 */
router.post('/queryAllTeacher', function (req, res, next) {
    const result = queryAllTeacher()
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
 * 解析上传的excel 批量导入管理员账号
 */
router.post('/fileTeacherAccount', function (req, res, next) {
    let excelFile = req.files.file.data;
    let excelData = [];
    let nowSex = []
    const workbook = XLSX.read(excelFile);
    const sheetNames = workbook.SheetNames[0]; 
    const createBy = req.body.createBy
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
                insertTeacherAccount(excelData[i]['姓名'], excelData[i]['密码'],createBy , createTime, 2, excelData[i]['账号'], nowSex[i]).then(data => {
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

/**
 * 查询管理员账号分页信息
 */
router.post('/queryAdminPage', function (req, res, next) {
    const { username, createBy, sex, account, startTime, endTime, pageSize, current } = req.body
    const result = queryAdminAccount(username, createBy, sex, account, startTime, endTime);
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
 * 新增管理员账号
 */
router.post('/insertAdminAccount', function (req, res, next) {
    const { username, password, sex, account, createBy, createName } = req.body
    const createTime = nowDate()
    const result = insertAdminAccount(username, password, createBy, createName, createTime, 1, account, sex)
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
 * 修改管理员账号
 */
router.post('/updataAdminAccount', function (req, res, next) {
    const { username, password, sex, account, id } = req.body
    const result = updataAdminAccount(username, password, account, sex, id)
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
 * 删除管理员账号
 */
router.post('/deleteAdminAccount', function (req, res, next) {
    const { id } = req.body
    const result = deleteAdminAccount(id)
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
 * 解析上传的excel 批量导入管理员账号
 */
router.post('/fileAdminAccount', function (req, res, next) {
    let excelFile = req.files.file.data;
    let excelData = [];
    let nowSex = []
    const workbook = XLSX.read(excelFile);
    const sheetNames = workbook.SheetNames[0]; 
    const { createBy, createName } = req.body
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
                insertAdminAccount(excelData[i]['姓名'], excelData[i]['密码'], createBy, createName, createTime, 1, excelData[i]['账号'], nowSex[i]).then(data => {
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
module.exports = router;
