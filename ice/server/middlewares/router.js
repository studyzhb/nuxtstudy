import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'

export const router=app=>{
    const router=new Router()

    router.all('/wechat-header',wechatMiddle(config.wechat,reply))
    //测试上传
    router.get('/upload',(ctx,next)=>{
        let mp=require('../wechat')
        let wechat=mp.getWechat()
        wechat.handleOperation('uploadMaterial','video',resolve(__dirname,''))
    })


    app.use(router.routes())
        .use(router.allowedMethods())

}