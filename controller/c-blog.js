const blogModel = require('../lib/sql/blogModel');
const svgCaptcha = require('svg-captcha');
const bcrypt = require('bcryptjs');

exports.getArticleList = async (ctx) => {
  const { id, title, labelid } = ctx.query;
  await blogModel.getArticle([id, title, labelid]).then(res => {
    res.map(v => {
      const contentArr = v.content.split('\n\n', 1);
      v.summary = isSummary(contentArr[0]);
      delete v.content;
    })
    ctx.body = { code: 1, message: 'success', data: res };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.getArticle = async (ctx) => {
  const { id, title, labelid } = ctx.query;
  await blogModel.getArticle([id, title, labelid]).then(res => {
    ctx.body = { code: 1, message: 'success', data: res };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.getTimeLine = async (ctx) => {
  await blogModel.getTimeLine().then(res => {
    const data = [];
    res.map(v => {
      let flag = true;
      data.map(v1 => {
        if (v1.month === v.createMonth) {
          v1.list.push(v);
          flag = false;
        }
      })
      if (flag) {
        data.push({ month: v.createMonth, list: [v] })
      }
    })
    ctx.body = { code: 1, message: 'success', data };
  }).catch(err => {
    ctx.status = 500;
    ctx.body = err;
  })
}

exports.captcha = async (ctx) => {
  const captcha = svgCaptcha.create({ width: 100, height: 35, fontSize: 40 });
  ctx.session.captcha = captcha.text;
  ctx.body = { code: 1, message: 'success', data: captcha.data };
}

exports.register = async (ctx) => {
  const { username, password, captcha } = ctx.request.body;
  if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
    ctx.body = { code: 0, message: '验证码错误' };
    return;
  }
  let isRegister = false;
  await blogModel.getInfoByUsername([username]).then(res => {
    if (res.length) {
      isRegister = true;
    }
  })
  if (isRegister) {
    ctx.body = { code: 0, message: '该用户已注册' };
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const newPassword = bcrypt.hashSync(password, salt);
  await blogModel.register([username, newPassword]).then(res => {
    ctx.body = { code: 1, message: '注册成功' }
  })
}

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  await blogModel.getInfoByUsername([username]).then(res => {
    if (!res.length) {
      ctx.body = { code: 0, message: '用户名或密码错误' };
      return;
    }
    const personalInfo = res[0];
    if (bcrypt.compareSync(password, personalInfo.password)) {
      ctx.session.personalInfo = personalInfo;
      blogModel.insertStatistics([personalInfo.id]);
      const resPersonalInfo = { ...personalInfo };
      delete resPersonalInfo.password;
      delete resPersonalInfo.id;
      ctx.body = { code: 1, message: '登录成功', data: resPersonalInfo };
      return;
    }
    ctx.body = { code: 0, message: '用户名或密码错误' };
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
//还有问题
exports.editUserInfo = async (ctx) => {
  const { avator, username, password, email } = ctx.request.body;
  const id = ctx.session.personalInfo.id;
  let isRegister = false;
  await blogModel.isUserExists([username, id]).then(res => {
    if (res.length) {
      isRegister = true;
    }
  })
  if (isRegister) {
    ctx.body = { code: 0, message: '该用户名已被占用' };
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const newPassword = bcrypt.hashSync(password, salt);
  await blogModel.editUserInfo([avator, username, newPassword, email, id]);
  await blogModel.getInfoByUsername([username]).then(res => {
    const personalInfo = res[0];
    ctx.session.personalInfo = personalInfo;
    const resPersonalInfo = { ...personalInfo };
    delete resPersonalInfo.password;
    delete resPersonalInfo.id;
    ctx.body = { code: 1, message: '保存成功', data: resPersonalInfo };
  })
}

function isSummary(str) {
  const execSummaryRes = />(.+)/g.exec(str);
  if (execSummaryRes) {
    return execSummaryRes[1];
  } else {
    return null;
  }
}