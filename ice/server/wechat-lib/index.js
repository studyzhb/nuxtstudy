import request from 'request-promise'
import formstream from 'formstream'
import fs from 'fs'

const base = 'https://api.weixin.qq.com/cgi-bin/'
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
    async fetchAccessToken() {
        let data = await this.getAccessToken()
        if (!this.isValidAccessToken(data)) {
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
    isValidAccessToken(data) {
        if (!data || !data.accessToken || !data.expires_in) {
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
    uploadMaterial(token,type,material,permanent){
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
            form.field('access_token',access_token)
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

}