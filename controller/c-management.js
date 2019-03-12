const managementModel = require('../lib/sql/managementModel');
const bcrypt = require('bcryptjs');

exports.login = async (ctx) => {
  let { username, password } = ctx.request.body;
  await managementModel.getUserInfo([username]).then(res => {
    if (!res.length) {
      ctx.body = { code: 0, message: '用户名或密码错误' };
      return;
    }
    let personalInfo = res[0];
    if (bcrypt.compareSync(password, personalInfo.password)) {
      ctx.session.personalInfo = personalInfo;
      ctx.body = { code: 1, message: '登录成功' };
      return;
    }
    ctx.body = { code: 0, message: '用户名或密码错误' };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.register = async (ctx) => {
  let { username, password } = ctx.request.body;
  //对密码进行加密,再保存数据库
  var salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  await managementModel.register([username, password]).then(res => {
    ctx.body = { code: 1, message: '注册成功' }
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.getLabel = async (ctx) => {
  await managementModel.getLabel().then(res => {
    ctx.body = { code: 1, message: 'success', data: res }
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.saveArticle = async (ctx) => {
  const { title, titleImage, content, label } = ctx.request.body;
  await managementModel.saveArticle([title, titleImage, content]).then(res => {
    return res.insertId;
  }).then(res => {
    label.map(async v => {
      await managementModel.saveLabel([res, v])
    })
    ctx.body = { code: 1, message: '保存成功' };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.saveImage = async (ctx) => {
  let path = ctx.req.file.path;
  if (path) {
    ctx.body = { code: 1, message: '图片上传成功', data: { image: '/' + path.replace(/\\/g, '/') } };
  } else {
    ctx.body = { code: 0, message: '图片上传失败' };
  }
}

exports.getSummary = async (ctx) => {
  await managementModel.getSummary().then(res => {
    let [{ num: totalUser }, { num: totalVisit }, { num: dailyVisit }] = res;
    let dateBegin = new Date(2019, 02, 04);
    let dateEnd = new Date();
    let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    let averageDailyVisit = Math.floor(totalVisit / dayDiff);
    ctx.body = { code: 1, message: 'success', data: { totalUser, totalVisit, dailyVisit, averageDailyVisit } };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.getOneWeekLoginData = async ctx => {
  await managementModel.getOneWeekLoginData().then(res => {
    ctx.body = { code: 1, message: 'success', data: res }
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}