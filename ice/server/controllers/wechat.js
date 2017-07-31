import * as api from '../api'
import {parse as urlParse} from 'url'
import {parse as queryParse} from 'querystring'
import config from '../config'

export async function signature(ctx,next) {
    let url=ctx.query.url
    if(!url) ctx.throw(404)
    
    url=decodeURIComponent(url)

    const params=await api.getSignatureAsync(url)

    ctx.body={
        success:true,
        params:params
    }
}

export async function redirect(ctx,next) {
    const target=config.SITE_ROOT_URL+'/oauth'
    const scope='snsapi_userinfo'
    const {a,b}=ctx.query

    const params=`${a}_${b}`

    const url=api.getAuthorizeURL(scope,target,params)
    console.log(url)
    let testurl=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7b9ceef1a29c162&redirect_uri=http://webzhb.ngrok.cc/oauth&response_type=code&scope=snsapi_us
erinfo&state=1_2#wechat_redirect`
    let testencodeurl=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7b9ceef1a29c162&redirect_uri=http%3A%2F%2Fwebzhb.ngrok.cc%2Foauth&response_type=code&scope=s
nsapi_userinfo&state=1_2#wechat_redirect`
    
    ctx.redirect(testurl)
}

export async function oauth(ctx,next) {
   let url=ctx.query.url
    
    url=decodeURIComponent(url)

    const urlObject=urlParse(url)

    const params=queryParse(urlObject.query)
    const code=params.code
    const user=await api.getUserByCode(code)
    console.log(user)

    ctx.body={
        success:true,
        data:user
    }

}