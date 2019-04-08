const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const static = require('koa-static');

const config = require('./config/default');

app.keys = ['some secret hurr'];
const sessionConfig = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000,//过期时间
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(bodyParser());
app.use(session(sessionConfig, app));
app.use(static(__dirname));

router.use('/blog-serve/management', require('./router/management').routes());
router.use('/blog-serve/blog', require('./router/blog').routes());

app.use(router.routes())//启动路由
    .use(router.allowedMethods());//建议加上
app.listen(config.port);