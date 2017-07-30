const tip = 'wo ce shi huanying\n' + 'ces'

export default async (ctx, next) => {
    const message = ctx.weixin
    console.log(message)

    let mp = require('../wechat')
    let client = mp.getWechat()

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            ctx.body = tip
        } else if (message.Event === 'unsubscribe') {
            console.log('qu guan')
        } else if (message.Event === 'LOCATION') {
            ctx.body = message.Latitude + ' : ' + message.Longitude
        } else if (message.Event === 'view') {
            //跳转事件
            ctx.body = message.EventKey + message.MenuId
        } else if (message.Event === 'pic_sysphoto') {
            ctx.body = message.Count + 'photos sent'
        }
    } else if (message.MsgType === 'text') {
        if(message.Content==='2'){
            const menu=require('./menu').default
            await client.handleOperation('delMenu')
            
            const menuData=client.handleOperation('createMenu',menu)
            console.log('menu')
            console.log(JSON.stringify(menuData))
        }
        ctx.body = message.Content
    } else if (message.MsgType === 'image') {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'voice') {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'video') {
        ctx.body = {
            title: message.ThumbMediaId,
            type: 'video',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_X + ':' + message.Location_Y + ' : ' + message.Label
    } else if (message.MsgType === 'link') {
        ctx.body = [
            {
                title: message.Title,
                description: message.Description,
                picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/vMtUYVgFia22Me1AhfynKkY5r6jctytLzb0BsA9VIR1BJb82tkkE9icx2MJsBHMMApAiaagYZKTNwcUhN4MAqViclQ/0',
                url: message.Url
            }
        ]
    } else if (message.MsgType === 'news') {

    }
}