var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const JwtUtil = require('./public/utils/jwt');

var usersRouter = require('./routes/users');


var app = express();

app.all('*', function (req, res, next) {    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-type,token");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  // 我这里知识把登录请求去掉了，其他的多有请求都需要进行token校验 
  if (req.url != '/api/users/login') {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登陆信息不正确
      if (result == 'err') {
          res.send({status: 403, msg: '登录已过期,请重新登录'});
          // res.render('login.html');
      } else {
          next();
      }
  } else {
      next();
  }
});

app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
