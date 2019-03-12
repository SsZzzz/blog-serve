const db = require('../mysql');

exports.getUserInfo = (value) => {
  const sql = "SELECT * FROM blog_management_user WHERE username=?";
  return db.query(sql, value);
}
exports.register = (value) => {
  const sql = "INSERT INTO blog_management_user (username,password) values (?,?)";
  return db.query(sql, value);
}
exports.getLabel = () => {
  const sql = "SELECT * FROM label";
  return db.query(sql);
}
exports.saveArticle = (value) => {
  const sql = "INSERT INTO blog_article (title,titleImage,content) values(?,?,?)";
  return db.query(sql, value);
}
exports.saveLabel = (value) => {
  const sql = "INSERT INTO blog_label (blogid,labelid) values(?,?)";
  return db.query(sql, value);
}
exports.getSummary = () => {
  //分别是用户总数,总访问量和日访问量
  const sql = `SELECT count( id ) num FROM blog_user
            union all
            SELECT max(id) FROM login_statistics 
            union all
            SELECT count( id ) FROM login_statistics WHERE to_days( loginTime ) = to_days( now( ) )`;
  return db.query(sql);
}
exports.getOneWeekLoginData = () => {
  let sql = `SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 6 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 6 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 5 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 5 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 4 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 4 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 3 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 3 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 2 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 2 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 1 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 1 DAY)
    UNION ALL
    SELECT COUNT(id) count,DATE_FORMAT(DATE_SUB(curdate(),INTERVAL 0 DAY),'%m-%d') date FROM login_statistics WHERE DATE(loginTime) = DATE_SUB(curdate(),INTERVAL 0 DAY)`;
  return db.query(sql);
}