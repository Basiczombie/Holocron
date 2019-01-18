const babel = require('babel-core/register')
const Koa = require('koa')
const Router = require('koa-router')
const bunyan = require('bunyan')
const logger = require('koa-bunyan-logger')
const serve = require('koa-static')
const fs = require('fs')

const app = new Koa()
const router = new Router()

// Routes
router
  .get('/', (ctx, next) => {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('./src/html/template.html')
  })

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// logger
let appLogger = bunyan.createLogger({
  name: 'holocron',
  level: 'debug',
  header: 'Request-Id',
  serializers: bunyan.stdSerializers
})

app.use(logger(appLogger))

// response
app
  .use(router.routes())
  .use(router.allowedMethods())

app
  .use(serve('./dist/static'))

app.listen(3000)
