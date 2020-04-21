var express = require('express');
var router = express.Router();
const JwtUtil = require('../public/utils/jwt');
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login, queryAllUsers } = require("../controller/users")

router.post('/login', function(req, res, next) {
  const {account, password, identity} = req.body
    const result = login(account,password,identity);
    const resultData = result.then(data => {
        // console.log(data)
        if (data.username) {
            // 将用户信息传入并生成token
            delete data.password
            const tokenData = data
            let jwt = new JwtUtil(tokenData);
            let token = jwt.generateToken();
            data.token = token
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
