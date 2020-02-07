/**
 * 信息分页处理
 * @param {Array} data 初始数据
 * @param {Number} pageSize 每页数据的条数
 * @param {Number} current 当前在第几页
 * @return {*} newData：返回筛选过后的数据 hasmore：是否存在下一页 total： 数据总条数
 */
const getPage = (data = [], pageSize = 10, current = 1) => {
    let hasmore, total = 0, newData = []
    pageSize=parseInt(pageSize)
    current=(parseInt(current) - 1)*pageSize
    newData=data.slice(current,current+pageSize)
    hasmore=current+pageSize > data.length ? false : true // 判断是否有下一页
    total = data.length
    return {
        newData,
        hasmore,
        total
    }
}
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
    getPage,
    nowDate
}