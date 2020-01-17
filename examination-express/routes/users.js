var express = require('express');
var router = express.Router();
const JwtUtil = require('../public/utils/jwt');
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { login, queryAllUsers } = require("../controller/users")

router.post('/login', function(req, res, next) {
  const {username, password, identity} = req.body
    const result = login(username,password,identity);
    const resultData = result.then(data => {
        if (data.username) {
            //存入cookie
            let _id = data.id;
            // 将用户id传入并生成token
            let jwt = new JwtUtil(_id);
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
