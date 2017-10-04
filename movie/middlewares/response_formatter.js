var ApiError=require('../app/error/ApiError')
/**
 * 在路由执行前调用
 */

 var response_formatter=(ctx,next)=>{
    
    if(ctx.body){
        ctx.body={
            code:0,
            message:'success',
            data:ctx.body
        }
    }else{
        ctx.body={
            code:0,
            message:'success'
        }
    }
 }

/**
 * 特定url进行格式化输出
 */

 var filter_url=(pattern)=>{
    return async (ctx,next)=>{
        var reg=new RegExp(pattern);
        try {
            await next();
        }catch(err){
            
            if(err instanceof ApiError && reg.test(ctx.originalUrl)){
                ctx.status=200;
                ctx.body={
                    code:err.code,
                    message:err.message
                }
            }
            throw err;
        }
        
        if(reg.test(ctx.originalUrl)){
            response_formatter(ctx)
        }
    }
 }

 module.exports=filter_url;