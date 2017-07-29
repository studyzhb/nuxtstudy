import mongoose from 'mongoose'

mongoose.Promise=Promise
mongoose.set('debug',true)

mongoose.connect('mongodb://',{
    useMongoClient:true
})

mongoose.connection.on('open',()=>{
    console.log('mongodb opened')
})


const UserSchema=new mongoose.Schema({
    name:String,
    times:{
        type:Number,
        default:0
    }
})

UserSchema.pre('save',function(next){
    this.times++
    next()
})

UserSchema.statics={
    async getUser(){
        const user=await this.findOne({name:name}).exec()
        return user;
    }

}

UserSchema.methods={
    async fetchUser(name){
        const user=await this.model('User').findOne({name:name}).exec()
        return user
    }
}


mongoose.model('User',UserSchema)

const User=mongoose.model('User')

;(async ()=>{
    console.log(await User.find({}).exec())

    // const user=new User({
    //     name:'Vue'
    // })

    // await user.save()


    const user=await User.findOne({name:'Vue SSR'}).exec()

    const newUser=await user.fetchUser('Vue SSR')

})()


