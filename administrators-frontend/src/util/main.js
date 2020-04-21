/**
 * 获取当前时间
 */
const nowDate = () => {
  var myDate = new Date();
  //获取当前年
  var year = myDate.getFullYear();
  //获取当前月
  var month = myDate.getMonth() + 1;
  //获取当前日
  var date = myDate.getDate();
  var h = myDate.getHours(); //获取当前小时数(0-23)
  var m = myDate.getMinutes(); //获取当前分钟数(0-59)
  var s = myDate.getSeconds();
  //获取当前时间
  var now = year + '-' + conver(month) + "-" + conver(date) + " " + conver(h) + ':' + conver(m) + ":" + conver(s);
  return now
}
//日期时间处理
function conver(s) {
  return s < 10 ? '0' + s : s;
}
module.exports = {
  nowDate
}