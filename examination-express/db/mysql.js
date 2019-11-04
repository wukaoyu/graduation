const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const { MYSQL_CONF } = require("../conf/db")

const con =  mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

//执行sql的函数
function exec(sql) {
    const promise =  new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = { exec }