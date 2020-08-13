const env = process.env.NODE_ENV || 'production'

//配置
let MYSQL_CONF
if (env === 'development') {
    MYSQL_CONF = {
        host: "localhost",
        user: "root",
        password: "7777",
        port: "3306",
        database: "graduation",
        dateStrings: true
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: "localhost",
        user: "root",
        password: "7777",
        port: "3306",
        database: "graduation",
        dateStrings: true
    }
}
module.exports = { MYSQL_CONF }