var ApiError=require('../error/ApiError');
var ApiErrorNames=require('../error/ApiErrorNames');

exports.getUser=async (ctx,next)=>{
    console.log(ctx.query)
    if(ctx.query.id!=1){
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
    ctx.body={
        name:'zhang',
        age:30
    }
}

exports.registerUser=async (ctx,next)=>{
    console.log('registerUser',ctx.request.body)
}