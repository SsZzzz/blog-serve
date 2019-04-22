const router = require('koa-router')()
const multer = require('koa-multer')
const controller = require('../controller/c-management')

const storage = multer.diskStorage({
  //文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/uploads/'); //注意路径必须存在
  },
  //修改文件名称
  filename(req, file, cb) {
    const fileFormat = file.originalname.split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({ storage })

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/getLabel', controller.getLabel);
router.post('/saveArticle', controller.saveArticle);
router.post('/updateArticle', controller.updateArticle);
router.post('/saveImage', upload.single('file'), controller.saveImage);
router.get('/getSummary', controller.getSummary);
router.get('/getOneWeekLoginData', controller.getOneWeekLoginData);
router.post('/delArticle', controller.delArticle);

module.exports = router;