const db = require('../mysql');

exports.getArticle = ([id, title, labelid]) => {
  let sql =
    `SELECT id,title,titleImage,content,date,label FROM 
    (SELECT id,title,titleImage,content,DATE_FORMAT(createTime, '%Y-%m-%d') date,labelid,
    (SELECT GROUP_CONCAT(
      (SELECT name FROM label WHERE id = labelid) SEPARATOR ',')
      FROM blog_label WHERE blogid = id GROUP BY blogid
    ) label 
    FROM blog_article a LEFT JOIN blog_label b ON a.id=b.blogid
    WHERE isDelete=0`;
  const sql1 = ` AND id=${id}`;
  const sql2 = ` AND title like '%${title}%'`;
  const sql3 = ` AND labelid=${labelid}`;
  const sqlLast = `) t GROUP BY id ORDER BY id DESC`;
  const sqlArr = [sql1, sql2, sql3];
  [id, title, labelid].map((v, i) => {
    if (v) {
      sql += sqlArr[i];
    }
  })
  return db.query(sql + sqlLast);
}

exports.getTimeLine = () => {
  const sql =
    `SELECT
      id,
      title,
      DATE_FORMAT(createTime, '%y-%m-%d') createDate,
      DATE_FORMAT(createTime, '%y-%m') createMonth
    FROM
      blog_article
    WHERE
      isDelete = 0
    ORDER BY
      createTime DESC`;
  return db.query(sql);
}

exports.getInfoByUsername = (value) => {
  const sql = "SELECT * FROM blog_user WHERE username=?";
  return db.query(sql, value);
}

exports.isUserExists = (value) => {
  const sql = "SELECT * FROM blog_user WHERE username=? AND id!=?";
  return db.query(sql, value);
}

exports.register = (value) => {
  const sql = "INSERT INTO blog_user (username,password) VALUES (?,?)";
  return db.query(sql, value);
}

exports.insertStatistics = (value) => {
  const sql = "INSERT INTO login_statistics (userId) VALUES (?)";
  return db.query(sql, value);
}

exports.editUserInfo = (value) => {
  const sql = "UPDATE blog_user SET avator=?,username=?,password=?,email=? WHERE id=?";
  return db.query(sql, value);
}