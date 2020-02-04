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
module.exports = {
    getPage
}