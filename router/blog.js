const router = require('koa-router')()
const multer = require('koa-multer')
const controller = require('../controller/c-blog')

const storage = multer.diskStorage({
  //文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/avator/'); //注意路径必须存在
  },
  //修改文件名称
  filename(req, file, cb) {
    const fileFormat = file.originalname.split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({ storage })

router.get('/getArticleList', controller.getArticleList);
router.get('/getArticle', controller.getArticle);
router.get('/getTimeLine', controller.getTimeLine);
router.get('/captcha', controller.captcha);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/saveImage', upload.single('image'), controller.saveImage);
router.post('/editUserInfo', controller.editUserInfo);
router.post('/comment', controller.comment);
router.get('/getCommentList', controller.getCommentList);

module.exports = router;