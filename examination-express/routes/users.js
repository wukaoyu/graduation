var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login, queryAllUsers } = require("../controller/users")

router.post('/login', function(req, res, next) {
  const {username, password, identity} = req.body
    const result = login(username,password,identity);
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
// 查询所有用户（这是拿来测试连接用的）
router.get('/queryAllUsers', function(req, res, next) {
      const result = queryAllUsers();
      const resultData = result.then(data => {
          if (data) {
              return new SuccessModel(data)
          }
          return new ErrorModel('查询失败')
      })
      resultData.then(data => {
          res.json(data)
      })
});

module.exports = router;
