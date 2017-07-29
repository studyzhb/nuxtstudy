import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'

import wechatMiddle from '../wechat-lib/middleware'

export const router=app=>{
    const router=new Router()

    router.all('/wechat-header',wechatMiddle(config.wechat,reply))



    app.use(router.routes())
        .use(router.allowedMethods())

}