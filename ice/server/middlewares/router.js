import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'


export const router=app=>{
    const router=new Router()

    router.all('/wechat-header',wechatMiddle(opts,reply))



    app.use(router.routes())
        .use(router.allowedMethods())

}