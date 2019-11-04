var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login } = require("../controller/users")

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const {username, password} = req.body
    // console.log(username)
    const result = login(username,password);
    const resultData = result.then(data => {
        if (data.username) {
            //存入cookie
            // res.setHeader("Set-Cookie", `name=${data.name};path=/; httpOnly; expires=${getCookieTime()}`);
            return new SuccessModel(data)
        }
        return new ErrorModel('登录失败')
    })
    resultData.then(data => {
        res.json(data)
    })
});

module.exports = router;
