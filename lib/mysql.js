var mysql = require('mysql');
var config = require('../config/default.js');

var pool = mysql.createPool(config.database);

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject('获取数据库连接失败.' + err);
      } else {
        connection.query(sql, values, (err, res) => {
          if (err) {
            reject('执行sql语句失败.' + err);
          } else {
            resolve(res);
          }
          connection.release();
        })
      }
    })
  })
};

module.exports = {
  query
};