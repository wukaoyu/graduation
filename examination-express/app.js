var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const JwtUtil = require('./public/utils/jwt');
var FileUpload = require('express-fileupload')

var usersRouter = require('./routes/users');
var utilsApiRouter = require('./routes/utilsApi');
var adminAccountRouter = require('./routes/admin/account');
var classesRouter = require('./routes/admin/classes');
var courseRouter = require('./routes/admin/course')
var examinationRouter = require('./routes/admin/examination')
var teacherClassesRouter = require('./routes/teacher/classes')
var teacherCourseRouter = require('./routes/teacher/course')
var teacherExaminationRouter = require('./routes/teacher/examination')


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
app.use(FileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if (req.url != '/api/users/login') {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登录信息不正确
      if (result == 'err') {
          res.send({status: 403, msg: '登录已过期,请重新登录'});
          // res.render('login.html');
      } else {
        global.userInfo = result
        next();
      }
  } else {
      next();
  }
});

app.use('/api/utilsApi', utilsApiRouter);
app.use('/api/users', usersRouter);

app.use('/api/admin/account', adminAccountRouter);
app.use('/api/admin/classes', classesRouter);
app.use('/api/admin/course', courseRouter);
app.use('/api/admin/examination', examinationRouter);

app.use('/api/teacher/classes', teacherClassesRouter);
app.use('/api/teacher/course', teacherCourseRouter);
app.use('/api/teacher/examination', teacherExaminationRouter);

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
