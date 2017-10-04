const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const logUtil=require('./utils/log_util')
const response_formatter=require('./middlewares/response_formatter')

const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')
const router = require('koa-router')()
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  let ms ;
  try{
    await next()
    ms = new Date() - start
    logUtil.logResponse(ctx,ms);
  }catch(err){
    ms = new Date() - start
    logUtil.logError(ctx,err,ms)
  }
  
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(response_formatter('^/api'));
// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
