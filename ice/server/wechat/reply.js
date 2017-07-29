const tip='wo ce shi huanying\n'+'ces'

export default async (ctx,next)=>{
    const message=ctx.weixin
    console.log(message)
    ctx.body=tip
}