import request from 'request-promise'
import formstream from 'formstream'
import path from 'path'
import fs from 'fs'
import * as _ from 'lodash'

import {sign} from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: base + 'token?grant_type=client_credential',
    //临时素材
    temporary:{
        upload:base+'media/upload?',
        fetch:base+'media/get?'
    },
    //永久素材
    permanent:{
        upload:base+'material/add_material?',
        uploadNewsPic:base+'media/uploadimg?',
        uploadNews:base+'material/add_news?',
        fetch:base+'material/get_material?',
        del:base+'material/del_material?',
        update:base+'material/update_news?',
        count:base+'material/get_materialcount?',
        batch:base+'material/batchget_material?'
    },
    tag:{
        create:base+'tags/create?',
        fetch:base+'tags/get?',
        update:base+'tags/update?',
        del:base+'tags/delete?',
        fetchUsers:base+'user/tag/get?',
        batchTag:base+'tags/members/batchtagging?',
        batchUntag:base+'tags/members/batchuntagging?',
        getTagList:base+'tags/getidlist?'
    },
    user:{
        remark:base+'user/info/updateremark?',
        info:base+'user/info?',
        batchinfo:base+'user/info/batchget?',
        fetchUserList:base+'user/get?',
        getBlackList:base+'tags/members/getblacklist?',
        batchBlackUsers:base+'tags/members/batchblacklist?',
        batchUnBlackUsers:base+'tags/members/batchunblacklist?'
    },
    menu:{
        create:base+'menu/create?',
        get:base+'menu/get?',
        del:base+'menu/delete?',
        addCondition:base+'menu/addconditional?',
        delCondition:base+'menu/delconditional?',
        getInfo:base+'get_current_selfmenu_info?'
    },
    ticket:{
        get:prefix+'ticket/getticket?'
    }
}

function statFile(filepath){
    return new Promise((resolve,reject)=>{
        fs.stat(filepath,(err,stat)=>{
            if(err) reject(err)
            else resolve(stat)
        })
    })
}

export default class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket
        this.fetchAccessToken()
    }
    async request(options) {
        options = Object.assign({}, options, { json: true })
        try {
            const response = await request(options)
            console.log(response)
            return response
        }catch(err){
            console.error(err)
        }
        
    }

    async fetchTicket(token) {
        let data = await this.getTicket()
        if (!this.isValidToken(data,'ticket')) {
            data = await this.updateTicket(token)
        }
        await this.saveTicket(data)
        return data
    }
    async updateTicket(token) {
        const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'
        let data = await this.request({ url: url })
        const now = new Date().getTime()
        const expiresIn = now + (data.expires_in - 20) * 1000
        data.expires_in = expiresIn
        return data
    }
    async fetchAccessToken() {
        let data = await this.getAccessToken()
        if (!this.isValidToken(data,'access_token')) {
            data = await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        return data
    }
    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
        const data = await this.request({ url: url })
        const now = new Date().getTime()
        const expiresIn = now + (data.expires_in - 20) * 1000
        data.expires_in = expiresIn
        return data
    }
    isValidToken(data,name) {
        if (!data || !data[name] || !data.expires_in) {
            return false
        }
        const expiresIn = data.expires_in
        const now = new Date().getTime()
        if (now < expiresIn) {
            return true
        } else {
            return false
        }
    }
    //上传
    async handleOperation(operation,...args){
        const tokenData=await this.fetchAccessToken()
        const options=await this[operation](tokenData.access_token,...args)
        const data=await this.request(options)
        return data
    }
    //封装上传参数
   async uploadMaterial(token,type,material,permanent){
        let from={}
        let url=api.temporary.upload
        if(permanent){
            url=api.permanent.upload
            _.extend(form,permanent)
        }
        if(type==='pic'){
            url=api.permanent.uploadNewsPic
        }
        if(type==='news'){
            url=api.permanent.uploadNews
            form=material
        }else{
            form=formstream()
            const stat=await statFile(material)
            form.file('media',material,path.basename(material),size)
        }
        let uploadUrl=url+'access_token='+token

        if(!permanent){
            uploadUrl+='&type='+type
        }else{
            form.field('access_token',token)
        }
        const options={
            method:'POST',
            url:uploadUrl,
            json:true
        }
        if(type==='news'){
            options.body=form
        }else{
            options.formData=form
        }

        return options;
    }
    //获取素材
    fetchMaterial(token,mediaId,type,permanent){
        let form={}
        let fetchUrl=api.temporary.fetch
        if(permanent){
            fetchUrl=api.permanent.fetch
        }

        let url=fetchUrl+'access_token='+token
        let options={method:'POST',url:url}

        if(permanent){
            form.media_id=mediaId
            form.access_token=token
            options.body=form

        }else{
            if(type==='video'){
                url=url.replace('https://','http://')
            }
            url+='&media_id='+mediaId
        }

        return options

    }
    //删除素材
    deleteMaterial(token,mediaId){
        const form={
            media_id:mediaId
        }

        const url=api.permanent.del+'access_token='+token+'&media_id='+mediaId

        return {method:'POST',url:url,body:form}
    }
    //更新素材
    updateMaterial(token,mediaId,news){
        const form={
            media_id:mediaId
        }
        _.extend(form,news)

        const url=api.permanent.update+'access_token='+token+'&media_id='+mediaId

        return {method:'POST',url:url,body:form}
    }
    //获取素材总数
    countMaterial(token){
        const url=api.permanent.count+'access_token='+token

        return {method:'POST',url:url}
    }
    //获取素材列表
    batchMaterial(token,options){
        options.type=options.type||'image'
        options.offset=options.offset||0
        options.count=options.count||10

        const url=api.permanent.batch+'access_token='+token

        return {method:'POST',url:url,body:options}
    }
    //创建标签
    createTag(token,name){
        const form={
            tag:{
                name:name
            }
        }
        const url=api.tag.create+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    //获取标签
    fetchTag(token){
        const url=api.tag.fetch+'access_token='+token

        return {url:url}
    }
    //编辑标签
    updateTag(token,tagId,name){
        const form={
            tag:{
                id:tagId,
                name:name
            }
        }
        const url=api.tag.update+'access_token='+token
        return {method:'POST',url:url,body:form}
    }
    //删除标签
    delTag(token,tagId,name){
        const form={
            tag:{
                id:tagId
            }
        }
        const url=api.tag.del+'access_token='+token
        return {method:'POST',url:url,body:form}
    }
    fetchTagUsers(token,tagId,openId){
        const form={
            tagid:tagId,
            next_openid:openId||''
        }
        
        const url=api.tag.fetchUsers+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    //批量为用户打标签
    batchTag(token,openIdList,tagId){
        const form={
            openid_list:openIdList,
            tagid:tagId
        }
        const url=api.tag.batchTag+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    //批量为用户去除标签
    batchUnTag(token,openIdList,tagId){
        const form={
            openid_list:openIdList,
            tagid:tagId
        }
        const url=api.tag.batchUnTag+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    //获取用户身上的标签
    getTagList(token,openId){
        const form={
            openid:openId
        }
        const url=api.tag.getTagList+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    remarkUser(token,openId,remark){
        const form={
            openid:openId,
            remark:remark
        }
        const url=api.user.remark+'access_token='+token

        return {method:'POST',url:url,body:form}
    }
    //获取用户的资料信息
    getUserInfo(token,openId,lang){
        const url=`
            ${api.user.info}access_token=${token}&openid=${openId}&lang=${lang||'zh_CN'}
        `
        return {url:url}
    }

    batchUserInfo(token,userList){
        const url=`
            ${api.user.batchInfo}access_token=${token}
        `
        const form={
            user_list:userList
        }
        return {method:'POST',url:url,body:form}
    }
    //获取用户列表
    fetchUserList(token,openId){
        const url=`
            ${api.user.fetchUserList}access_token=${token}&next_openid=${openId||''}
        `
        return {url:url}
    }
    createMenu(token,menu){
        const url=api.menu.create+'access_token='+token
        return {method:'POST',url:url,body:menu}
    }
    getMenu(token){
        const url=api.menu.get+'access_token='+token

        return {url:url}
    }
    delMenu(token){
        const url=api.menu.del+'access_token='+token

        return {url:url}
    }
    //添加自定义菜单
    addConditionMenu(token,menu,rule){
        const url=api.menu.addCondition+'access_token='+token

        const form={
            button:menu,
            matchrule:rule
        }

        return {method:'POST',url:url,body:form}
    }
    //删除自定义菜单
    delConditionMenu(token,menuId){
        const url=api.menu.delCondition+'access_token='+token

        const form={
            menuid:menuId
        }

        return {method:'POST',url:url,body:form}
    }
    getCurrentMenuInfo(token){
        const url=api.menu.getInfo+'access_token='+token

        return {url}
    }
    sign(ticket,url){
        return sign(ticket,url)
    }
}