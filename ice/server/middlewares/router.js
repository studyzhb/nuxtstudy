import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import wechat from '../controllers/wechat'

export const router=app=>{
    const router=new Router()

    router.all('/wechat-header',wechatMiddle(config.wechat,reply))

    router.get('/wechat-signature',wechat.signature)

    app.use(router.routes())
        .use(router.allowedMethods())

}